<?php

class ApiController extends pm_Controller_Action
{
    protected $_accessLevel = 'admin';

    public function listAction(): void
    {
        $domains = pm_Domain::getAllDomains();
        $data = array_map(function (pm_Domain $domain) {
            return [
                'name' => $domain->getDisplayName(),
                'application' => 'unknown',
            ];
        }, $domains);
        $this->_helper->json(array_values($data));
    }

    public function refreshAction(): void
    {
        $this->_helper->json();
    }
}
