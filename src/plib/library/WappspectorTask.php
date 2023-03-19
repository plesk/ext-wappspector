<?php

namespace PleskExt\Wappspector;

use PleskExt\Wappspector\FileSystem\Factory;
use Psr\Container\ContainerInterface;
use Plesk\Wappspector\DIContainer;
use Plesk\Wappspector\FileSystemFactory;
use Plesk\Wappspector\Wappspector;

class WappspectorTask extends \pm_LongTask_Task
{
    public function getSteps()
    {
        $domains = array_map('intval', $this->getParam('domains', []));
        $loading = array_map('intval', $this->getParam('loading', []));
        return array_combine(
            array_map('strval', $domains),
            array_map(function ($id) use ($loading) {
                $domain = \pm_Domain::getByDomainId($id);
                return [
                    'key' => (string)$id,
                    'title' => $domain->getDisplayName(),
                    'status' => in_array($id, $loading) ? (reset($loading) === $id ? 'running' : 'not_started') : 'done',
                ];
            }, $domains)
        );
    }

    public function run()
    {
        $domains = \pm_Domain::getAllDomains();
        $this->setParam('domains', array_map(function ($domain) {
            return $domain->getId();
        }, $domains));
        $loading = [];
        foreach ($domains as $domain) {
            $domain->setSetting('wapp', '');
            $loading[$domain->getId()] = true;
        }
        $this->setParam('loading', array_keys($loading));

        foreach ($domains as $domain) {
            $matcher = $this->scanDomain($domain);
            $domain->setSetting('wapp', $matcher['matcher']);
            $domain->setSetting('wapp-version', $matcher['version'] ?? null);

            unset($loading[$domain->getId()]);
            $this->setParam('loading', array_keys($loading));
        }
    }

    public function onDone()
    {
        $manager = new \pm_LongTask_Manager();
        $manager->cancel($this);
    }

    private function scanDomain(\pm_Domain $domain): array
    {
        if (!$domain->hasHosting()) {
            return [
                'matcher' => 'nohosting',
            ];
        }

        $container = DIContainer::build();
        $container->set(FileSystemFactory::class, function () use ($domain) {
            return new Factory($domain);
        });

        try {
            $results = $container->get(Wappspector::class)->run($domain->getDocumentRoot());
            foreach ($results as $matcher) {
                return $matcher;
            }
        } catch (\Exception $e) {
            \pm_Log::err($e);
        }

        return [
            'matcher' => 'unknown',
        ];
    }
}
