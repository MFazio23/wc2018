import React, {Component} from 'react';
import GA from 'react-ga';
import Config from "./util/Config";

GA.initialize('UA-52217136-7', {
    debug: Config.firebaseEnv === 'test'
});

const withGA = (WrappedComponent, options = {}) => {
    const trackPage = page => {
        GA.set({
            page,
            ...options
        });
        GA.pageview(page);
    };

    return class extends Component {
        componentDidMount() {
            const page = this.props.location.pathname;
            trackPage(page);
        }

        componentWillReceiveProps(nextProps) {
            const currentPage = this.props.location.pathname;
            const nextPage = nextProps.location.pathname;

            if (currentPage !== nextPage) {
                trackPage(nextPage);
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
};

export default withGA;