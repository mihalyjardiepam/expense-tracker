import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { ServiceConfig } from "./config";

const sdk = new NodeSDK({
  serviceName: `${ServiceConfig.serviceName}:${ServiceConfig.serviceVersion}`,
  traceExporter: new OTLPTraceExporter({}),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      concurrencyLimit: 1,
    }),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
