import  React, { useState, useContext } from 'react'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import logo from '../../assets/sepolia.png'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { WalletContext } from '../../context/WalletContext';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
function Header() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {handleAuth,isWalletConnected,formattedAccount,currentAccount,userBalance}=useContext(WalletContext)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
  return (
    <AppBar position="static" style={{ background: '#432D2D' }}>
      <Container maxWidth="xl" >
        <Toolbar disableGutters>

        <Card sx={{margin: "0 auto", padding: "3.1em", border: "none", boxShadow: "none", background:"rgba(0,0,0,0)",  display: { xs: 'none', md: 'flex' }, mr: 1 }}>
          <CardMedia 
            component="img"
            height="40"
            sx={{ objectFit: "fit" }}
            image={logo}
            alt="Live from space album cover"
          />
        
        </Card>
      
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
           
                {currentAccount ? (
                   <Menu
                   id="menu-appbar"
                   anchorEl={anchorElNav}
                   anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'left',
                   }}
                   keepMounted
                   transformOrigin={{
                     vertical: 'top',
                     horizontal: 'left',
                   }}
                   open={Boolean(anchorElNav)}
                   onClose={handleCloseNavMenu}
                   sx={{
                     display: { xs: 'block', md: 'none' },
                   }}
                 >
                     <MenuItem>
                        <Typography>
                      Address: {formattedAccount}
                      </Typography>
                    </MenuItem>
                    <MenuItem>
                
                   <Typography>
                   Balance : {Number(userBalance).toFixed(5)} SepoliaETH
                   </Typography>
                   </MenuItem>
                   </Menu>
                ): (
                  <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                  <Button variant="outlined" onClick={handleAuth}>Connect Wallet</Button>
                  </Menu>
                )}
          
          </Box>
      
          <Card sx={{margin: "0 auto", padding: "3.1em", border: "none", boxShadow: "none", background:"rgba(0,0,0,0)",  display: { xs: 'flex', md: 'none' }, mr: 1 }}>
          <CardMedia 
            component="img"
            height="40"
            sx={{ objectFit: "fit" }}
            image={logo}
            alt="Live from space album cover"
          />
        
        </Card>
      
         
          {currentAccount ? (
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    
                     <Typography>
                   Address: {formattedAccount}
                   </Typography>
                   <Typography style={{marginLeft:20}}>
                   Balance : {Number(userBalance).toFixed(5)} SepoliaETH
                   </Typography>
                  </Box>
                ): (
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Button variant="outlined" onClick={handleAuth}>Connect Wallet</Button>
                  </Box>  
                )}
   


        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header