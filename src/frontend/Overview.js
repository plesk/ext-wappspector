import {
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
}
