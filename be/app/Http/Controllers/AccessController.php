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

    public function addToQueue(Request $request)
    {
        $userId = $request->input('user_id');

        $positionInProcessing = $this->findUserPosition($this->processingKey, $userId);
        if ($positionInProcessing !== -1) {
            return response()->json(['wait_count' => -1]); // Nếu người dùng đang xử lý, không cho phép thêm vào hàng đợi
        }

        $positionInQueue = $this->findUserPosition($this->queueKey, $userId);
        if ($positionInQueue !== -1) {
            $waitCount = $this->calculateWaitCount($this->queueKey, $this->processingKey, $userId);
            return response()->json(['wait_count' => $waitCount]); // Nếu người dùng đã có trong hàng đợi, trả về vị trí và số lượt chờ
        }

        Redis::rpush($this->queueKey, $userId);

        // Tiến hành xử lý hàng đợi
        $this->processQueue();

        $waitCount = $this->calculateWaitCount($this->queueKey, $this->processingKey, $userId);

        broadcast(new QueueUpdated($userId, $waitCount));

        return response()->json(['wait_count' => $waitCount]);
    }

    public function processQueue()
    {
        $queue = Redis::lrange($this->queueKey, 0, -1);
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);

        // Xử lý hàng đợi khi số lượng người đang xử lý ít hơn số tối đa cho phép
        while (count($processingQueue) < $this->maxProcessing && !empty($queue)) {
            $userId = array_shift($queue);

            // Nếu người dùng đang được xử lý, bỏ qua
            if ($this->findUserPosition($this->processingKey, $userId) !== -1) {
                continue;
            }

            // Thêm người dùng vào danh sách đang xử lý
            Redis::rpush($this->processingKey, $userId);

            // Xóa người dùng khỏi hàng đợi
            Redis::lpop($this->queueKey);

            broadcast(new QueueUpdated($userId, 0));

            // Cập nhật lại các hàng đợi
            $queue = Redis::lrange($this->queueKey, 0, -1);
            $processingQueue = Redis::lrange($this->processingKey, 0, -1);
        }
    }

    public function finishProcessing(Request $request)
    {
        $userId = $request->input('user_id');

        // Tìm và xóa người dùng khỏi danh sách đang xử lý
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);
        foreach ($processingQueue as $item) {
            if ($item == $userId) {
                Redis::lrem($this->processingKey, 0, $item);
                break;
            }
        }

        // Xóa người dùng khỏi hàng đợi
        $queue = Redis::lrange($this->queueKey, 0, -1);
        foreach ($queue as $key => $user) {
            if ($user == $userId) {
                Redis::lrem($this->queueKey, 0, $userId);
                break;
            }
        }

        broadcast(new QueueUpdated($userId, -1));

        // Tiến hành xử lý lại hàng đợi
        $this->processQueue();

        return response()->json(['message' => 'Đã hoàn thành xử lý và xóa người khỏi cả hàng đợi.']);
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
        $position = array_search($userId, $queue);

        return $position === false ? -1 : max(0, $position + 1);
    }

    public function checkQueue(Request $request)
    {
        $userId = $request->input('user_id');

        // Kiểm tra vị trí của người dùng trong hàng đợi
        $positionInQueue = $this->findUserPosition($this->queueKey, $userId);
        if ($positionInQueue !== -1) {
            return response()->json(['inQueue' => true, 'wait_count' => $positionInQueue]);
        }

        return response()->json(['inQueue' => false]);
    }
}
