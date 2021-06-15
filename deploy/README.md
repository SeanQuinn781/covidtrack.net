Systemd services to run the shell scripts that start the react and flask app as daemons

copy the files to systemd
```
cp *.service /etc/systemd/system/
```

enable the services to run on reboot

```
sudo systemctl enable dFlask.service
sudo systemctl enable dReact.service
```

start the services 
```
sudo service dFlask start
sudo service dReact start
```

For nginx configuration see covidtrack.net


TODO: better deployment

