import React, { Component } from 'react';

export class Modal extends Component() {
  displayName: 'Modal',
  backdrop() {
    return <div className='modal-backdrop in' />;
  }
  modal() {
    var style = {display: 'block'};
    return (
      <div
        className='modal in'
        tabIndex='-1'
        role='dialog'
        aria-hidden='false'
        ref='modal'
        style={style}
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  },

  render() {
    return (
      <div>
        {this.backdrop()}
        {this.modal()}
      </div>
    );
  }
};

export class Confirm extends Component {
  displayName: 'Confirm',
  getDefaultProps() {
    return {
      confirmLabel: 'OK',
      abortLabel: 'Cancel'
    };
  },

  abort() {
    return this.promise.reject();
  },

  confirm() {
    return this.promise.resolve();
  },

  componentDidMount() {
    this.promise = new $.Deferred();
    return React.findDOMNode(this.refs.confirm).focus();
  },

  render() {
    var modalBody;
    if (this.props.description) {
      modalBody = (
        <div className='modal-body'>
          {this.props.description}
        </div>
      );
    }

    return (
      <Modal>
        <div className='modal-header'>
          <h4 className='modal-title'>
            {this.props.message}
          </h4>
        </div>
        {modalBody}
        <div className='modal-footer'>
          <div className='text-right'>
            <button
              role='abort'
              type='button'
              className='btn btn-default'
              onClick={this.abort}
            >
              {this.props.abortLabel}
            </button>
            {' '}
            <button
              role='confirm'
              type='button'
              className='btn btn-primary'
              ref='confirm'
              onClick={this.confirm}
            >
              {this.props.confirmLabel}
            </button>
          </div>
        </div>
      </Modal>
    );
  }
};

export class confirm(message, options) {
  var cleanup, component, props, wrapper;
  if (options == null) {
    options = {};
  }
  props = $.extend({
    message: message
  }, options);
  wrapper = document.body.appendChild(document.createElement('div'));
  component = React.render(<Confirm {...props}/>, wrapper);
  cleanup = function() {
    React.unmountComponentAtNode(wrapper);
    return setTimeout(function() {
      return wrapper.remove();
    });
  };
  return component.promise.always(cleanup).promise();
};


$(function() {
  return $('.removable').click(function() {
    return confirm('Are you sure?', {
      description: 'Would you like to remove this item from the list?',
      confirmLabel: 'Yes',
      abortLabel: 'No'
    }).then((function(_this) {
      return function() {
        return $(_this).parent().remove();
      };
    })(this));
  });
});
