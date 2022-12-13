import { Injectable, Inject, Logger } from '@nestjs/common';
import { Codec, JetStreamPublishOptions, JSONCodec, PubAck } from 'nats';
import { NATS_JETSTREAM_OPTIONS } from './constants';
import { NatsJetStreamClientOptions } from './interfaces/nats-jetstream-client-options.interface';
import { NatsJetStreamTransportConnection } from './nats-jetstream-transport.connection';

@Injectable()
export class NatsJetStreamClient {
  private logger = new Logger(this.constructor.name);
  private codec: Codec<JSON>;

  constructor(
    private nc: NatsJetStreamTransportConnection,
    @Inject(NATS_JETSTREAM_OPTIONS) private options: NatsJetStreamClientOptions,
  ) {
    this.codec = JSONCodec();
  }
  async publish<JSON>(
    pattern: any,
    event: any,
    publishOptions?: Partial<JetStreamPublishOptions>,
  ): Promise<PubAck> {
    const natsConnection = await this.nc.assertConnection();
    const payload = this.codec.encode(event);
    const js = natsConnection.jetstream(this.options.jetStreamOption);

    this.logger.debug(
      `Write ${event.type} on ${pattern} #${event.correlationId}`,
    );
    // console.log(pattern, event, publishOptions);
    return js.publish(pattern, payload, publishOptions);
  }
}
