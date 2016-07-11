#! /bin/bash
grep -v secure_path /etc/sudoers > /etc/sudoers
#
Ver="2.7.11"
wget http://www.python.org/ftp/python/$Ver/Python-$Ver.tar.xz -P /usr/src
cd /usr/src
tar xf Python-$Ver.tar.xz
cd /usr/src/Python-$Ver

./configure --prefix=/usr/local --enable-unicode=ucs4 --enable-shared LDFLAGS="-Wl,-rpath /usr/local/lib"
make && make altinstall
cd /opt/files
#
wget https://bootstrap.pypa.io/ez_setup.py
# 
python2.7 /opt/files/ez_setup.py
# 
easy_install-2.7 pip
pip install tornado requests
