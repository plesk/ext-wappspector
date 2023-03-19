import {
    Icon,
    Link,
    List,
    ListEmptyView,
    Button,
    ContentLoader,
    Toolbar,
    ToolbarGroup,
    Component,
    createElement,
    PropTypes,
} from '@plesk/plesk-ext-sdk';

import axios from 'axios';

export default class Overview extends Component {
    static propTypes = {
        baseUrl: PropTypes.string.isRequired,
    };

    state = {
        data: null,
        taskId: null,
        loading: [],
    };

    componentDidMount() {
        window.Jsw.Observer.append(({ id, status, steps }) => {
            if (this.state.taskId === id) {
                if (['done', 'error', 'canceled'].includes(status)) {
                    this.setState({ taskId: null });
                }
                this.setState({
                    loading: steps
                        .filter(({ status }) => !['done', 'error', 'canceled'].includes(status))
                        .map(({ key }) => key)
                })
                this.refresh();
            }
        }, 'plesk:taskStepUpdate');

        this.refresh();
    }

    refresh() {
        const { baseUrl } = this.props;
        axios.get(`${baseUrl}/api/list`).then(({ data }) => this.setState({ data }));
    }

    render() {
        if (this.state.data === null) {
            return <ContentLoader />;
        }
        return (
            <List
                columns={[
                    {
                        key: 'name',
                        title: 'Domain name',
                    },
                    {
                        key: 'application',
                        title: 'Application',
                        render: row => this.renderButton(row),
                    },
                ]}
                data={this.state.data}
                loadingRows={this.state.loading}
                onSelectionChange={() => {}}
                emptyView={
                    <ListEmptyView
                        title="Nothing found so far?.. No problem!"
                        description="You can refresh the data."
                        actions={this.renderRefreshButton()}
                    />
                }
                toolbar={(
                    <Toolbar>
                        <ToolbarGroup>{this.renderRefreshButton()}</ToolbarGroup>
                    </Toolbar>
                )}
            />
        );
    }

    renderRefreshButton() {
        return <Button intent="primary" onClick={() => this.scan()}>{'Scan your websites'}</Button>;
    }

    scan() {
        const { baseUrl } = this.props;
        axios.post(`${baseUrl}/api/scan`).then(({ data: { id } }) => this.setState({ taskId: id }));
    }

    renderButton(row) {
        const nolinks = {
            nohosting: true,
            unknown: true,
        };
        const domainOverviewLink = `/smb/web/overview/id/${row.key}/type/domain`;
        const links = {
            composer: `/modules/composer/index.php/domain-page/index/id/${row.key}`,
            dotnet: `/modules/dot-net/index.php/index/domain?dom_id=${row.webspaceId}&site_id=${row.key}`,
            joomla: `/modules/joomla-toolkit/index.php/index/index?dom_id=${row.webspaceId}&site_id=${row.key}`,
            laravel: `/modules/laravel/index.php/index/domain?dom_id=${row.webspaceId}&site_id=${row.key}`,
            nodejs: `/modules/nodejs/index.php/domain/index?dom_id=${row.webspaceId}&site_id=${row.key}`,
            ruby: `/modules/ruby/index.php/domain/index?dom_id=${row.webspaceId}&site_id=${row.key}`,
            wordpress: `/modules/wp-toolkit/index.php/domain/list/id/${row.key}`,
        };
        if (nolinks[row.application]) {
            return this.renderName(row);
        }
        const link = `/admin/subscription/login/id/${row.webspaceId}?pageUrl=${encodeURIComponent(links[row.application] ?? domainOverviewLink)}`;
        return <Button ghost component={Link} href={link} icon={this.renderIcon(row)}>{this.renderName(row)}</Button>;
    }

    renderIcon({ application }) {
        const icons = {
            composer: 'composer.svg',
            dotnet: 'dotnet.svg',
            drupal: 'drupal.svg',
            joomla: 'joomla.svg',
            laravel: 'laravel.svg',
            nodejs: 'nodejs.svg',
            php: 'php.svg',
            prestashop: 'prestashop.svg',
            python: 'python.svg',
            ruby: 'ruby.svg',
            typo3: 'typo3.svg',
            wordpress: 'wordpress.svg',
        };
        if (!icons[application]) {
            return '';
        }

        const { baseUrl } = this.props;
        const dirname = url => url.split('/').slice(0, -1).join('/');
        const icon = `${dirname(baseUrl)}/images/${icons[application]}`;

        return <Icon src={icon} />
    }

    renderName({ application }) {
        const displayNames = {
            nohosting: 'No hosting',
            unknown: '—',
            composer: 'Composer',
            dotnet: '.NET',
            drupal: 'Drupal',
            joomla: 'Joomla!',
            laravel: 'Laravel',
            nodejs: 'Node.js',
            php: 'PHP',
            prestashop: 'PrestaShop',
            python: 'Python',
            ruby: 'Ruby',
            typo3: 'TYPO3',
            wordpress: 'WordPress',
        };
        return displayNames[application] ?? application;
    }
}
