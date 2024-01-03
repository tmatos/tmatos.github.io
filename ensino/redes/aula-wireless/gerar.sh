#!/bin/sh

IN=slides.md
OUT=slides.html

pandoc -t revealjs --mathjax -s $IN -o $OUT

sed -i 's/https:\/\/unpkg.com\/reveal.js@^4\/\//lib\//g' $OUT

sed -i 's/https:\/\/cdn.jsdelivr.net\/npm\/mathjax@3/lib\/mathjax/g' $OUT
