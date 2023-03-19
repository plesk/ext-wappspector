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
        const links = {
            composer: 'TODO',
            dotnet: 'TODO',
            drupal: 'TODO',
            joomla: 'TODO',
            laravel: 'TODO',
            nodejs: 'TODO',
            php: 'TODO',
            prestashop: 'TODO',
            python: 'TODO',
            ruby: 'TODO',
            typo3: 'TODO',
            wordpress: 'TODO',
        };
        if (!links[row.application]) {
            return this.renderName(row);
        }
        return <Button ghost component={Link} icon={this.renderIcon(row)}>{this.renderName(row)}</Button>;
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
