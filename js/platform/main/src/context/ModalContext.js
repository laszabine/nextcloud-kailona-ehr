import React from 'react';
import ImportDataModal from '../components/ImportData/ImportDataModal';
import RequestDataModal from '../components/RequestData/RequestDataModal';
import ProfileEditModal from '../components/ProfileHeader/ProfileEditModal';
import { Snackbar, withStyles } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const ModalContext = React.createContext();

const styles = {
    feedbackMessage: {
        '& .MuiAlert-message': {
            fontSize: '14px',
        },
    },
};

class ModalProviderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isImportDataModalOpen: false,
            isRequestDataModalOpen: false,
            isProfileEditModalOpen: false,
            profileEditModalProps: {},
            isSnackbarOpen: false,
            feedback: {},
        };
    }

    toggleImportDataModal = (open, feedback) => {
        this.setState({
            isImportDataModalOpen: open,
            isSnackbarOpen: !open,
            feedback: feedback || {},
        });
    };

    toggleRequestDataModal = open => {
        this.setState({
            isRequestDataModalOpen: open,
        });
    };

    toggleProfileEditModal = (open, props = {}) => {
        this.setState({
            isProfileEditModalOpen: open,
            profileEditModalProps: props,
        });
    };

    render() {
        const { feedback } = this.state;
        const { classes } = this.props;
        return (
            <ModalContext.Provider
                value={{
                    toggleImportDataModal: this.toggleImportDataModal,
                    toggleRequestDataModal: this.toggleRequestDataModal,
                    toggleProfileEditModal: this.toggleProfileEditModal,
                }}
            >
                {this.props.children}
                <ImportDataModal
                    isOpen={this.state.isImportDataModalOpen}
                    onClose={feedback => this.toggleImportDataModal(false, feedback)}
                />
                <RequestDataModal
                    isOpen={this.state.isRequestDataModalOpen}
                    onClose={() => this.toggleRequestDataModal(false)}
                />
                <ProfileEditModal
                    isOpen={this.state.isProfileEditModalOpen}
                    onClose={() => this.toggleProfileEditModal(false)}
                    {...this.state.profileEditModalProps}
                />

                <Snackbar
                    open={this.state.isSnackbarOpen}
                    className={classes.feedbackMessage}
                    autoHideDuration={3000}
                    onClose={() => this.setState({ isSnackbarOpen: false })}
                >
                    <Alert severity={feedback.severity} className="feedbackMessage" onClose={() => {}}>
                        {feedback.message}
                    </Alert>
                </Snackbar>
            </ModalContext.Provider>
        );
    }
}

const withModal = Component => {
    return function WrapperComponent(props) {
        return <ModalContext.Consumer>{context => <Component {...props} {...context} />}</ModalContext.Consumer>;
    };
};

const ModalProvider = withStyles(styles)(ModalProviderComponent);

export { ModalContext, ModalProvider, withModal };
