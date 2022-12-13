import { Injectable, Inject } from '@nestjs/common';
import { NatsConnection, connect } from 'nats';
import { NATS_JETSTREAM_OPTIONS } from './constants';
import { NatsJetStreamClientOptions } from './interfaces/nats-jetstream-client-options.interface';

@Injectable()
export class NatsJetStreamTransportConnection {
  private nc: NatsConnection;

  constructor(
    @Inject(NATS_JETSTREAM_OPTIONS) private options: NatsJetStreamClientOptions,
  ) {
    this.assertConnection();
  }
  public async assertConnection(): Promise<NatsConnection> {
    if (!this.nc) {
      this.nc = await connect(this.options.connectionOptions);
    }

    return this.nc;
  }
  private async close(): Promise<void> {
    await this.nc.drain();
    await this.nc.close();
    this.nc = undefined;
  }
}
