<?php

namespace PleskExt\Wappspector\FileSystem;

use League\Flysystem\Config;
use League\Flysystem\DirectoryAttributes;
use League\Flysystem\FileAttributes;
use League\Flysystem\FilesystemAdapter;

class Adapter implements FilesystemAdapter
{
    private \pm_FileManager $fileManager;

    public function __construct(
        private \pm_Domain $domain,
        private string $baseDir,
    ) {
        $this->fileManager = new \pm_FileManager($this->domain->getId());
    }

    public function fileExists(string $path): bool
    {
        return $this->fileManager->fileExists($this->fileManager->joinPath($this->baseDir, $path));
    }

    public function directoryExists(string $path): bool
    {
        return $this->fileManager->fileExists($this->fileManager->joinPath($this->baseDir, $path));
    }

    public function write(string $path, string $contents, Config $config): void
    {
        throw new NotSupportedException();
    }

    public function writeStream(string $path, $contents, Config $config): void
    {
        throw new NotSupportedException();
    }

    public function read(string $path): string
    {
        return $this->fileManager->fileGetContents($this->fileManager->joinPath($this->baseDir, $path));
    }

    public function readStream(string $path)
    {
        $fd = fopen('php://memory', 'rw');
        fwrite($fd, $this->read($path));
        rewind($fd);

        return $fd;
    }

    public function delete(string $path): void
    {
        throw new NotSupportedException();
    }

    public function deleteDirectory(string $path): void
    {
        throw new NotSupportedException();
    }

    public function createDirectory(string $path, Config $config): void
    {
        throw new NotSupportedException();
    }

    public function setVisibility(string $path, string $visibility): void
    {
        throw new NotSupportedException();
    }

    public function visibility(string $path): FileAttributes
    {
        // TODO: Implement visibility() method.
        throw new NotSupportedException();
    }

    public function mimeType(string $path): FileAttributes
    {
        // TODO: Implement mimeType() method.
        throw new NotSupportedException();
    }

    public function lastModified(string $path): FileAttributes
    {
        // TODO: Implement lastModified() method.
        throw new NotSupportedException();
    }

    public function fileSize(string $path): FileAttributes
    {
        return new FileAttributes($path, (int)$this->fileManager->fileSize($this->fileManager->joinPath($this->baseDir, $path)));
    }

    public function listContents(string $path, bool $deep): iterable
    {
        if ($deep) {
            // TODO: Implement $deep = true
            throw new NotSupportedException();
        }
        $items = $this->fileManager->scanDir($this->fileManager->joinPath($this->baseDir, $path), true);
        foreach ($items as $item) {
            // TODO: new DirectoryAttributes($this->fileManager->joinPath($path, $item))
            yield new FileAttributes($this->fileManager->joinPath($path, $item));

        }
    }

    public function move(string $source, string $destination, Config $config): void
    {
        throw new NotSupportedException();
    }

    public function copy(string $source, string $destination, Config $config): void
    {
        throw new NotSupportedException();
    }
}
