export PATH=/home/sdahal/softwares/miniconda3/bin:$PATH
source activate venv1
cd /home/sdahal/new/Data
yesterday=$(date -d "yesterday 07:00" '+%Y%m%d')
mkdir /home/sdahal/new/Data/$yesterday
export LOGSPATH=/home/sdahal/new/Data/$yesterday/Log.txt
cd /home/sdahal/new/Codes_Backup/
echo ========================================================================>>$LOGSPATH
echo =>>$LOGSPATH
echo =>>$LOGSPATH
date>>$LOGSPATH
echo =>>$LOGSPATH
echo =>>$LOGSPATH
echo ========================================================================>>$LOGSPATH

echo started downloading >>$LOGSPATH
date>>$LOGSPATH
python3 ./main_download_script.py>>$LOGSPATH
echo done>>$LOGSPATH
date>>$LOGSPATH
echo ------------------------------------------->>$LOGSPATH

echo =================================================================================>>$LOGSPATH
