/*! Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license. */
import '../../yamui';
import * as React from 'react';
import { join } from '../../util/classNames';
import { BaseComponentProps } from '../../util/BaseComponent/props';
import { Focusable } from '../../util/Focusable';
import Clickable from '../Clickable';
import EditIcon from '../Icon/icons/Edit';
import TextField from '../TextField';
import { KeyCodes } from '../../util/keyCodes';
import { getClassNames } from './EditableText.styles';

export interface EditableTextProps extends BaseComponentProps {
  /**
   * Current text.
   */
  text?: string;

  /**
   * The text to display when text is empty.
   */
  promptText?: string;

  /**
   * The TextField placeHolder text.
   */
  placeHolder?: string;

  /**
   * An optional max length for the description field when editing.
   */
  maxLength?: number;

  /**
   * Returns the new text string when updated. Triggered by enter keypress or blur event to close the textfield.
   */
  onUpdate?: ((text: string) => void);

  /**
   * Triggered when the user enters edit mode.
   */
  onBeginEditing?: (() => void);

  /**
   * Triggered when the user exits edit mode.
   */
  onEndEditing?: (() => void);
}

export interface EditableTextState {
  isEditing: boolean;
  editedValue: string;
}

/**
 * Displays text which can be edited on click.
 */
export default class EditableText extends React.Component<EditableTextProps, EditableTextState> {
  private textFieldFocusable: Focusable | null;
  private clickableFocusable: Focusable | null;

  constructor(props: EditableTextProps) {
    super(props);
    this.textFieldFocusable = null;
    this.clickableFocusable = null;
    this.state = { isEditing: false, editedValue: '' };
  }

  public render() {
    const { editedValue, isEditing } = this.state;
    const { text, promptText, placeHolder, maxLength, className } = this.props;
    const classNames = getClassNames({ isEditing });
    const rootClassNames = join(['y-editableText', className, classNames.root]);

    if (isEditing) {
      return (
        <div className={rootClassNames}>
          <TextField
            underlined={true}
            onChange={this.updateInternalEditedDescription}
            value={editedValue}
            placeHolder={placeHolder}
            maxLength={maxLength}
            focusableRef={this.setTextFieldFocusable}
            onBlur={this.commitEdit}
            onKeyDown={this.onKeyDown}
          />
        </div>
      );
    }

    return (
      <span className={rootClassNames}>
        <Clickable
          onClick={this.handleEditClick}
          unstyled={true}
          ariaLabel={promptText}
          focusableRef={this.setClickableFocusable}
        >
          <EditIcon />
          <span className={classNames.clickableText}>{text || promptText}</span>
        </Clickable>
      </span>
    );
  }

  public componentDidUpdate(_prevProps: EditableTextProps, prevState: EditableTextState) {
    // Set focus when we enter edit mode
    if (this.state.isEditing && !prevState.isEditing) {
      this.setTextFieldFocus();
    }

    // Restore focus after leaving edit mode
    if (!this.state.isEditing && prevState.isEditing) {
      this.setClickableFocus();
    }
  }

  private onKeyDown = (event: any) => {
    switch (event.which) {
      case KeyCodes.escape:
        event.preventDefault();
        this.cancelEdit();
        break;
      case KeyCodes.enter:
        event.preventDefault();
        this.commitEdit();
        break;
      default:
    }
  };

  private setTextFieldFocusable = (focusable: Focusable | null) => {
    this.textFieldFocusable = focusable;
  };

  private setClickableFocusable = (focusable: Focusable) => {
    this.clickableFocusable = focusable;
  };

  private updateInternalEditedDescription = (description: string) => {
    this.setState(() => ({ editedValue: description }));
  };

  private setTextFieldFocus() {
    if (this.textFieldFocusable) {
      this.textFieldFocusable.focus();
    }
  }

  private setClickableFocus() {
    if (this.clickableFocusable) {
      this.clickableFocusable.focus();
    }
  }

  private handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    this.setState(() => ({ isEditing: true, editedValue: this.props.text || '' }));
    if (this.props.onBeginEditing) {
      this.props.onBeginEditing();
    }
  };

  private cancelEdit = () => {
    this.setState(() => ({ isEditing: false, editedValue: '' }));
    if (this.props.onEndEditing) {
      this.props.onEndEditing();
    }
  };

  private commitEdit = () => {
    const { editedValue } = this.state;
    this.setState(() => ({ isEditing: false, editedValue: '' }));
    if (this.props.onUpdate) {
      this.props.onUpdate(editedValue);
    }
    if (this.props.onEndEditing) {
      this.props.onEndEditing();
    }
  };
}
