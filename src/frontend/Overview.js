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
    };

    componentDidMount() {
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
        return <Button intent="primary">{'Scan your websites'}</Button>;
    }
}
