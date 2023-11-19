const amqplib = require('amqplib');
module.exports.CreateChannel = async () => {
    try {
      const connection = await amqplib.connect("amqps://ziewshsq:47A0Acrtle_2FmuYtnJ9LdThgd8MfKVm@octopus.rmq3.cloudamqp.com/ziewshsq");
      const channel = await connection.createChannel();
      await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", { durable: true });
      return channel;
    } catch (err) {
      throw err;
    }
  };
  
  module.exports.PublishMessage = (channel, BindingKey, msg) => {
    channel.publish(process.env.EXCHANGE_NAME, BindingKey, Buffer.from(msg));
  };
  
  module.exports.SubscribeMessage = async (channel, service) => {
    await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", { durable: true });
    const q = await channel.assertQueue("", { exclusive: true });

    channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, "PRODUCT-BROKER");
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.content) {
          service.subscribeevents(msg.content.toString());
        }
      },
      {
        noAck: true,
      }
    );
  };