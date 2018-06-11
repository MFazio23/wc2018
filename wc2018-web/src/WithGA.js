import React, {Component} from 'react';
import GA from 'react-ga';
import {Config} from "./util/Config";

GA.initialize('UA-52217136-6', {
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

    const HOC = class extends Component {
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

    return HOC;
};

export default withGA;