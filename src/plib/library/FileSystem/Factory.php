<?php

namespace PleskExt\Wappspector\FileSystem;

use League\Flysystem\Filesystem;

class Factory
{
    public function __construct(private \pm_Domain $domain)
    {
    }

    public function __invoke(string $path): Filesystem
    {
        $adapter = new Adapter($this->domain, $path);

        return new Filesystem($adapter);
    }
}
