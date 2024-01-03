#!/bin/sh

IN=slides.md
OUT=slides.html

pandoc -t revealjs -s $IN -o $OUT --mathjax --self-contained
