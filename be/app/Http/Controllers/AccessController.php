<?php
namespace App\Http\Controllers;

use App\Events\QueueUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class AccessController extends Controller
{
    private $queueKey = 'change_schedule_access_queue';
    private $processingKey = 'processing_queue';
    private $maxProcessing = 2;
    private $processingTimeLimit = 300;

    public function addToQueue(Request $request)
    {
        $userId = $request->input('user_id');

        if ($this->findUserPosition($this->queueKey, $userId) !== -1 || $this->findUserPosition($this->processingKey, $userId) !== -1) {
            return response()->json(['message' => 'Bạn đã có trong hàng đợi hoặc đang được xử lý.'], 400);
        }

        Redis::rpush($this->queueKey, $userId);

        $this->processQueue();

        $waitCount = $this->calculateWaitCount($this->queueKey, $this->processingKey, $userId);

        broadcast(new QueueUpdated($userId, $waitCount));

        return response()->json(['wait_count' => $waitCount]);
    }

    public function processQueue()
{
    $queue = Redis::lrange($this->queueKey, 0, -1);
    $processingQueue = Redis::lrange($this->processingKey, 0, -1);

    while (count($processingQueue) < $this->maxProcessing && !empty($queue)) {
        $userId = array_shift($queue);

        $data = [
            'user_id' => $userId,
            'timestamp' => time(),
            'expire_at' => time() + $this->processingTimeLimit,
        ];

        Redis::rpush($this->processingKey, json_encode($data));

        Redis::lpop($this->queueKey);

        broadcast(new QueueUpdated($userId, 0));

        $queue = Redis::lrange($this->queueKey, 0, -1);
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);
    }
}


    public function finishProcessing(Request $request)
    {
        $userId = $request->input('user_id');
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);

        foreach ($processingQueue as $item) {
            $data = json_decode($item, true);
            if ($data['user_id'] == $userId) {
                Redis::lrem($this->processingKey, 0, $item);
                break;
            }
        }

        broadcast(new QueueUpdated($userId, -1));

        $this->processQueue();

        return response()->json(['message' => 'Đã hoàn thành xử lý và xóa khỏi hàng đợi.']);
    }

    private function findUserPosition($queueKey, $userId)
    {
        $queue = Redis::lrange($queueKey, 0, -1);
        $position = array_search($userId, $queue);

        return $position === false ? -1 : $position;
    }

    private function calculateWaitCount($queueKey, $processingKey, $userId)
    {
        $queue = Redis::lrange($queueKey, 0, -1);
        $processingCount = Redis::llen($processingKey);
        $position = array_search($userId, $queue);

        return $position === false ? -1 : max(0, $position + 1);
    }

    public function cleanExpiredProcessingItems()
    {
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);
        $currentTime = time();

        foreach ($processingQueue as $item) {
            $data = json_decode($item, true);
            if (isset($data['expire_at']) && $data['expire_at'] <= $currentTime) {
                Redis::lrem($this->processingKey, 0, $item);
                broadcast(new QueueUpdated($data['user_id'], -1));
            }
        }
    }
}
