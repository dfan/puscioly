#!/bin/bash

fileOne=${1}
fileTwo=${2}
numLines=${3:-"1"}

diff <(head -n ${numLines} ${fileOne}) <(head -n ${numLines} ${fileTwo})