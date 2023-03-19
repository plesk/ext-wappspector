<?php

use PleskExt\Wappspector\WappspectorTask;

class ApiController extends pm_Controller_Action
{
    protected $_accessLevel = 'admin';

    public function listAction(): void
    {
        $domains = pm_Domain::getAllDomains();
        $data = array_map(function (pm_Domain $domain) {
            return [
                'key' => $domain->getId(),
                'name' => $domain->getDisplayName(),
                'application' => $domain->getSetting('wapp', 'not scanned yet'),
            ];
        }, $domains);

        if (count($data) === count(array_filter($data, fn ($row) => $row['application'] === 'not scanned yet'))) {
            $data = [];
        }
        $this->_helper->json(array_values($data));
    }

    public function scanAction(): void
    {
        if (!$this->_request->isPost()) {
            throw new pm_Exception('Permission denied');
        }

        $manager = new pm_LongTask_Manager();
        $task = new WappspectorTask();
        $manager->start($task);

        $this->_helper->json($task);
    }
}
