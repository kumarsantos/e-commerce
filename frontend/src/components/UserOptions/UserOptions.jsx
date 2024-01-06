import React, { useState } from 'react';
import { Backdrop, SpeedDial, SpeedDialAction } from '@mui/material';
import './UserOptions.scss';
import { MdDashboard } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { BiLogOut } from 'react-icons/bi';
import { BsCardChecklist } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../redux/actions/userAction';
import { MdOutlineShoppingCart } from 'react-icons/md';

const UserOptions = (user) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const orders = () => {
    navigate('/orders');
  };
  const account = () => {
    navigate('/account');
  };
  const cart = () => {
    navigate('/cart');
  };
  const logoutUser = () => {
    dispatch(logout());
    alert.success('Logout Successfully');
  };
  const dashboard = () => {
    navigate('/dashboard');
  };

  const actionList = [
    {
      icon: <BsCardChecklist style={{ fontSize: '24px' }} />,
      tooltip: 'Orders',
      name: 'Orders',
      func: orders,
    },
    {
      icon: <CgProfile style={{ fontSize: '24px' }} />,
      tooltip: 'Profile',
      name: 'Profile',
      func: account,
    },
    {
      icon: <MdOutlineShoppingCart style={{ fontSize: '24px' }} />,
      tooltip: 'Cart',
      name: 'Cart',
      func: cart,
    },
    {
      icon: <BiLogOut style={{ fontSize: '24px' }} />,
      tooltip: 'Logout',
      name: 'Logout',
      func: logoutUser,
    },
  ];
  if (user?.user?.user?.role === 'user') {
    actionList.unshift({
      icon: <MdDashboard style={{ fontSize: '24px' }} />,
      name: 'Dashboard',
      func: dashboard,
      tooltip: 'Dashboard',
    });
  }
  return (
    <>
      <Backdrop open={open} style={{ zIndex: '10' }} />
      <SpeedDial
        ariaLabel='SpeedDial tooltip example'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        className='speedDial'
        open={open}
        icon={
          user?.user?.avatar?.url ? (
            <img
              src={user?.user?.avatar?.url}
              alt='prifile'
              className='speedDialIcon'
            />
          ) : (
            <CgProfile style={{ fontSize: '32px' }} />
          )
        }
        direction='down'
      >
        {actionList?.map((item, i) => {
          return (
            <SpeedDialAction
              key={i}
              icon={item?.icon}
              tooltipTitle={item?.tooltip}
              onClick={item?.func}
              // tooltipOpen={window.innerWidth<=600 ? true:false}
            />
          );
        })}
      </SpeedDial>
    </>
  );
};

export default UserOptions;
