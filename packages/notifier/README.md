# Notifier

## Place the Firebase Certificate

- Get a certificate from `Firebase Settings > Project Settings > Service Accounts > Firebase Admin SDK`
- Place cert in `config/lanflix-firebase-cert.json`

## Add Email Credentials

Using the template under `config/template_sender.json`, create a file in the same directory called `sender.json` swapping the name, email and password to match your desired email account to send notifications from.

## Turn on Email Notifications

To receive emails for requests from the website and emails from download notifications, you need to have the lanflix-monitor running.

### Option A: Auto boot on start with systemd

- Run `./install.sh`
- Check the status of the services
```bash
sudo systemctl status lanflix-monitor.service
```

### Option B: Run a script in a terminal

Execute the npm monitor script using:

```
npm run monitor
```

When this process is closed, the monitor will no longer run. If you would prefer to have it as a background service, go to .

### Custom Application Scripts

In order to be notified that content has been added, the application that grabs the content needs to talk to LanFlix, `./scripts` helps with that.

Currently only supporting Sonarr and Radarr.
