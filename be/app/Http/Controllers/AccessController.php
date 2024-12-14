<?php

namespace App\Http\Controllers;

use App\Events\QueueUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class AccessController extends Controller
{
    private $queueKey = 'change_schedule_access_queue';
    private $processingKey = 'processing_queue';
    public function addToQueue(Request $request)
    {
        $userId = $request->input('user_id');
        $queueKey = $this->queueKey;
        $processingKey = $this->processingKey;

        $waitCount = $this->findUserPosition($queueKey, $userId);

        if ($waitCount !== -1) {
            return response()->json([
                'wait_count' => $waitCount,
            ]);
        }

        Redis::rpush($queueKey, $userId);

        $queueSize = Redis::llen($queueKey);
        $processingCount = Redis::llen($processingKey);

        $waitCount = max(0, $queueSize - $processingCount);

        if ($waitCount === 0) {
            Redis::rpush($processingKey, $userId);
            Redis::expire($this->processingKey, 300);
        }

        return response()->json([
            'wait_count' => $waitCount,
        ]);
    }

    public function checkPosition(Request $request)
    {
        $userId = $request->input('user_id');
        $queue = Redis::lrange($this->queueKey, 0, -1);

        $waitCount = array_search($userId, $queue);

        if ($waitCount === false) {
            return response()->json([
                'message' => 'Bạn chưa ở trong hàng đợi.',
            ], 404);
        }

        return response()->json([
            'wait_count' => $waitCount,
        ]);
    }


    public function processQueue()
    {
        $queue = Redis::lrange($this->queueKey, 0, -1);
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);

        if (count($processingQueue) < 2) {
            $neededSlots = 2 - count($processingQueue);
            $usersToProcess = array_slice($queue, 0, $neededSlots);

            foreach ($usersToProcess as $userId) {
                $data = [
                    'user_id' => $userId,
                    'timestamp' => time(),
                ];
                Redis::rpush($this->processingKey, json_encode($data));

                Redis::lrem($this->queueKey, 0, $userId);

                broadcast(new QueueUpdated($userId, 0));
            }
        }

        $this->removeExpiredUsers();

        return response()->json([
            'processing_users' => Redis::lrange($this->processingKey, 0, -1),
        ]);
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

        Redis::lrem($this->queueKey, 0, $userId);

        broadcast(new QueueUpdated($userId, -1));

        return response()->json([
            'message' => 'Đã hoàn thành xử lý và xóa khỏi hàng đợi.',
        ]);
    }

    private function findUserPosition($queueKey, $userId)
    {
        $queue = Redis::lrange($queueKey, 0, -1);
        $position = array_search($userId, $queue);

        return $position === false ? -1 : $position;
    }
    private function removeExpiredUsers()
    {
        $processingQueue = Redis::lrange($this->processingKey, 0, -1);

        foreach ($processingQueue as $item) {
            $data = json_decode($item, true);

            if (time() - $data['timestamp'] > 2) {
                Redis::lrem($this->processingKey, 0, $item);
                broadcast(new QueueUpdated($data['user_id'], -1));
            }
        }
    }

}
