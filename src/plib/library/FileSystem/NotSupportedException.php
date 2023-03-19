<?php

namespace PleskExt\Wappspector\FileSystem;

use League\Flysystem\FilesystemException;

class NotSupportedException extends \pm_Exception implements FilesystemException
{}
