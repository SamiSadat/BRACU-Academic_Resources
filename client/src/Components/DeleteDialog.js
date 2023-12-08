import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteForum, deleteUser } from '../Redux/apiCalls';
import { logout } from '../Redux/userRedux';

export default function DeleteDialog({ ids, render, onSave, entityName }) {
  const [open, setOpen] = useState(false);

  const user = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    onSave && onSave();

    for (const id of ids) {
      if (entityName === 'Forum') {
        try {
          await deleteForum(id, dispatch);
          history.push('/forum');
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await deleteUser(id, dispatch);

          if (user._id === id) {
            dispatch(logout());

            history.push('/home');
          } else {
            history.push('/people');
          }
        } catch (err) {
          console.log(err);
        }
      }
    }

    handleClose();
  };

  return (
    <div>
      {render(handleClickOpen)}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Delete {entityName}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the {entityName}
          {ids.length > 1 && 's'}?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleSave} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
