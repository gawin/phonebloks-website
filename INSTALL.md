## OS X Installation

First install home brew.

- [homebrew](http://brew.sh/)

## Update homebrew and install PCRE, lualib and redis

```
brew update
brew install pcre lualib redis
```

## Download and install OpenResty

Check for the latest version of OpenResty (adjust url to latest stable version number).
OpenResty includes nginx

```
curl -O http://openresty.org/download/ngx_openresty-1.7.10.2.tar.gz

tar xzvf ngx_openresty-*.tar.gz
cd ngx_openresty-*/
./configure --with-cc-opt="-I /usr/local/Cellar/pcre/8.37/include -I /usr/local/Cellar/luajit/2.0.4/include" --with-ld-opt="-L /usr/local/Cellar/pcre/8.37/lib -L /usr/local/Cellar/luajit/2.0.4/lib" --with-luajit
make
make install
```

## Add nginx to your path

Unfortunately OpenResty nginx is not automatically added to you PATH, so we need to add it manually. 

```
vim ~/.bash_profile
export PATH="${PATH}:/usr/local/openresty/nginx/sbin"
```

## Start the beast

```
cd phonebloks-website
./scripts/start
```
