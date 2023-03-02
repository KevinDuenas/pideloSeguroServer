import { Signale } from "signale";

const config = {
  displayTimestamp: true,
  displayDate: true,
};

const db = new Signale({
  scope: "db",
  interactive: true,
  config,
});

const api = new Signale({
  scope: "api",
  config,
});

const scripts = new Signale({
  scope: "scripts",
  config,
});

const cronjobs = new Signale({
  scope: "cronjobs",
  config,
});

export { db, api, scripts, cronjobs };
