# coding=utf8
import json
import os
import re
import string
import subprocess
import sys
from optparse import OptionParser

import time


def ref_func():
    parser = OptionParser()
    # parser.add_option("-i", "--input", dest="input",action="store_true",help="input x y for each file by user")
    parser.add_option("-q", "--quality", dest="q", action="store", help="input xvid q arg", default="24")
    parser.add_option("-v", "--vcodec", dest="vcodec", action="store", help="input video codec", default="x264")
    parser.add_option("-n", "--noaudio", dest="an", action="store_true", help="no audio")
    parser.add_option("-p", "--preset", dest="preset", action="store", help="", default="")
    parser.add_option("-m", "--maxWidth", dest="maxWidth", action="store", help="input max width for output video",
                      default="")
    parser.add_option("-f", "--fileType", dest="fileType", action="store", help="", default="mp4")
    parser.add_option("-o", "--ogg", dest="ogg", action="store_true", help="user ogg instead of aac", default="")
    parser.add_option("-3", "--mp3", dest="mp3", action="store_true", help="user mp3 instead of aac", default="")
    parser.add_option("-1", "--pad", dest="pad", action="store_true", help="pad to 16:9", default="")
    parser.add_option("-s", "--src", dest="srcD", action="store", help="source dir",
                      default="/usr/disk2/root/video/origin")
    parser.add_option("-t", "--target", dest="targetD", action="store", help="target dir",
                      default="/usr/disk2/root/video/ok")
    parser.add_option("-w", "--workdir", dest="workdir", action="store", help="work dir", default="/root/root2/video")

    (options, args) = parser.parse_args()

    if options.srcD is None or options.srcD[0:1] == '-':
        print 'srcD Err, quit'
        exit()
    if options.targetD is None or options.targetD[0:1] == '-':
        print 'targetD Err, quit'
        exit()
    if options.fileType is None or options.fileType[0:1] == '-':
        print 'fileType Err, quit'
        exit()
    if options.workdir is None or options.workdir[0:1] == '-':
        print 'workdir Err, quit'
        exit()

    # 遍历origin下的文件
    for root, dirs, files in os.walk(options.srcD):
        for name in files:
            name = name.replace('[', '''\[''')  # 对文件名中的[进行转义
            newname = name[0: name.rindex('.')]

            # 运行一次ffmpeg,获取分辨率
            (si, so, se) = os.popen3(
                'cd ' + options.workdir + ';mkdir -p ffm;  rm -f ffm/ffm.txt ; csh -c "(ffmpeg -i ' + options.srcD + '/' + name + ' >& ffm/ffm.txt)"; grep Stream ffm/ffm.txt')
            t = so.readlines()
            ti = 0
            for line in se.readlines():
                print line

            width = 0
            height = 0

            reg = '''^\s*Stream.*,\s*(\d+)x(\d+)(?: \[SAR|,)'''
            # Stream #0.0: Video: RV40 / 0x30345652, 1020x572, 23 fps, 23 tbr, 23 tbn, 23 tbc
            for line in t:
                result = re.compile(reg).findall(line)

                for c in result:
                    print name + ' ' + c[0] + 'x' + c[1]
                    width = string.atoi(c[0])
                    height = string.atoi(c[1])
                    if name[
                       0:3] == 'M2U' and width == 720 and height == 576:  # m2U开头的，宽度是720x576的，是4：3存储16：9的，将其转换为16：9
                        width = 1024

            if width == 0:
                print 'error parsing width and height'
                exit()

            vc = ''
            qstr = ''
            astr = ''
            vpre = ''
            s = ''

            if options.maxWidth != '':
                if width > string.atoi(options.maxWidth):
                    height = height * string.atoi(options.maxWidth) / width
                    width = string.atoi(options.maxWidth)

            padStr = ''
            if options.pad:
                if height * 16 / 9 - width > 10:  # 宽度不够
                    padStr = ' -vf "pad=' + str(height * 16 / 9) + ':' + str(height) + ':' + str(
                        (height * 16 / 9 - width) / 2) + ':0:black"'
                elif width - height * 16 / 9 > 10:  # 高度不够
                    padStr = ' -vf "pad=' + str(width) + ':' + str(width * 9 / 16) + ':0:' + str(
                        (width - height * 16 / 9) / 2) + ':black"'

            s = ' -s ' + str(width) + 'x' + str(height) + padStr
            print 'adjust', s

            if options.preset != '':
                vpre = ' -vpre ' + options.preset

            if options.an:
                astr = ' -an'
            elif options.ogg:
                astr = ' -acodec libvorbis -ar 44100 -ab 64K'
            elif options.mp3:
                astr = ' -acodec libmp3lame -ar 44100 -ab 64K'
            else:
                astr = ' -acodec libfaac -ar 44100 -ab 64K'

            if options.vcodec == 'vp8':
                vc = 'libvpx'
                qstr = " -qmin " + options.q + " -qmax " + options.q
            elif options.vcodec == 'x264':
                vc = 'libx264'
                qstr = " -crf " + options.q
            elif options.vcodec == 'xvid':
                vc = 'libxvid'
                qstr = " -qmin " + options.q + " -qmax " + options.q

            cmd = 'csh -c "' + "cd " + options.workdir + ";touch ffm/output.log;(ffmpeg -y -i " + options.srcD + "/" + name + astr + " -vcodec " + vc + vpre + qstr + s + " -r 25  -threads 8 " + options.targetD + "/" + newname + "." + options.fileType + ' >>& ffm/output.log)"'
            print cmd

            # 运行
            [si, so, se] = os.popen3(cmd)
            for line in se.readlines():  # 打印输出
                print line
            for line in so.readlines():  # 打印输出
                print line

                # print cmd,'   finish'#再显示一次命令


class UnicodeStreamFilter:
    def __init__(self, target):
        self.target = target
        self.encoding = 'utf-8'
        self.errors = 'replace'
        self.encode_to = self.target.encoding

    def write(self, s):
        if type(s) == str:
            s = s.decode("utf-8")
        s = s.encode(self.encode_to, self.errors).decode(self.encode_to)
        self.target.write(s)


def main():
    start_time = time.time()
    print "start time %s" % start_time
    parser = OptionParser()
    parser.add_option("-i", "--input", dest="input", action="store_true",
                      default="I:\\movie\\电子科技大学嵌入式系统（压缩版）\\01.wmv",
                      help="input x y for each file by user")
    (option, args) = parser.parse_args()
    print option.input
    # child = subprocess.Popen("cmd \" /c  chcp 65001 | dir && chcp 65001 |dir h:\\ \" ", stdout=subprocess.PIPE)
    child = subprocess.Popen(u"cmd /c \"cd /d I:/movie/电子科技大学嵌入式系统（压缩版） && ffprobe  -v quiet  -print_format json  "
                             u"-show_streams 01.wmv \" ".encode('gbk'), stdout=subprocess.PIPE)
    out = child.stdout
    # if out.encoding == 'cp936':
    # out = UnicodeStreamFilter(out)
    jsonstr = ""
    if out is not None:
        line = out.readline()
        while line != "":
            # print line
            jsonstr += line
            line = out.readline()
    child.wait()
    params = dict()
    json_obj = json.loads(jsonstr)
    print json_obj
    print json_obj[u'streams'][0][u'codec_type']
    print json_obj[u'streams'][1][u'codec_type']
    for stream in json_obj[u'streams']:
        codec_type = stream[u'codec_type']
        if codec_type == 'audio':
            params['b:a'] = stream['bit_rate']
            params['codec_name:a'] = stream[u'codec_name']
        elif codec_type == 'video':
            params['b:v'] = stream[u'bit_rate']
            params['codec_name:v'] = stream[u'codec_name']
    print params
    end_time = time.time()
    print "take time %s s" % (end_time - start_time)

if __name__ == "__main__":
    print sys.getdefaultencoding()
    print sys.stdout.encoding
    if sys.stdout.encoding == 'cp936':
        sys.stdout = UnicodeStreamFilter(sys.stdout)
    main()
