<?php

namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

class RabbitMQService
{
    protected $connection;
    protected $channel;

    public function __construct()
    {
        $this->connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
        $this->channel = $this->connection->channel();
    }

    public function sendMessageToQueue($data)
    {
        $this->channel->queue_declare('class_registration_queue', false, true, false, false);

        $msg = new AMQPMessage(json_encode($data));
        $this->channel->basic_publish($msg, '', 'class_registration_queue');

        $this->channel->close();
        $this->connection->close();
    }
}
