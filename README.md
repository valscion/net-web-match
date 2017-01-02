# JS-version of [NetMatch](https://github.com/cb-hackers/NetMatch)

To run, use a modern node version. This is tested to work at least on node v6.7.0.

```
git submodule update
cd ige/server
npm install
cd ../..
PORT=3501 node ./ige/server/ige -g ./source
```

Launch up a HTTP server of some sort to port 3500 (1 minus the `PORT` variable used above) as asset and JS serving happens outside of the node server:

```
python -m SimpleHTTPServer 3500
```

Then go to http://localhost:3500/source to start the game
