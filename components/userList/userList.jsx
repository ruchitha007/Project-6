// import React from 'react';
// import {
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,Link,Button
// }
// from '@mui/material';
// import './userList.css';

// /**
//  * Define UserList, a React component of project #5
//  */
// class UserList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       users: window.models.userListModel(),
//           };
    
//   }
//   handleUserClick = (user) => {
//     this.props.setTopName(`${user.first_name} ${user.last_name}`);
    
//   };
//   render() {
    
//     return ( 
      
//       <div>
        
//         <List component="nav">
//   {this.state.users.map((user) => (
//     <div key={user._id}>
//       <ListItem>
//         <Button
//           component={Link}
//           to={`/users/${user._id}`}
//           className="ButtonStyle"
//           onClick={() => {
//             this.handleUserClick(user);
//             console.log(user);
//           }}
//         >
//           {`${user.first_name} ${user.last_name}`}
//         </Button>
//       </ListItem>
//       <Divider />
//     </div>
//   ))}
//         </List>

//         <Typography variant="body1">
//           The model comes in from window.models.userListModel()
//         </Typography>
//       </div>
//     );
//   }
// }

// export default UserList;
// import React from 'react';
// import { Divider, List, ListItem, Button} from '@mui/material';
// import { Link } from 'react-router-dom';  // Import Link from react-router-dom
// import './userList.css';
// // import FetchModel from '../../lib/fetchModelData';

// class UserList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userList: [],
//     };
//   }

//   componentDidMount() {
//     const userList = window.models.userListModel();
//     this.setState({ userList });
//   }

//   handleUserClick = (user) => {
//          this.props.setTopName(`User Details of ${user.first_name} ${user.last_name}`);
        
//        };
//   render() {
//     const { userList } = this.state;

//     return (
//       <div >
//         <div>
//           <List component="nav">
//             {userList.map((user) => (
//               <div key={user._id}>
//                 <ListItem>
//                   <Button
//                   onClick={() => {
//                     this.handleUserClick(user); 
//                 }}
//                     component={Link}
//                     to={`/users/${user._id}`}
//                     className="ButtonStyle" 
//                   >
//                     {`${user.first_name} ${user.last_name}`}
//                   </Button>
//                 </ListItem>
//                 <Divider />
//               </div>
//             ))}
//           </List>
//         </div>
//         <div style={{ width: '70%' }}>
//           {this.props.children}
//         </div>
//       </div>
//     );
//   }
// }
// export default UserList;
import React from 'react';
import { Divider, List, ListItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import FetchModel from '../../lib/fetchModelData';
import './userList.css';


class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    const url = '/user/list';

    axios.get(url)
      .then((response) => {
        this.setState({ userList: response.data });
      })
      .catch((error) => {
        console.error('Error fetching user list:', error);
      });
  }

  handleUserClick = (user) => {
    this.props.setTopName(`User Details of ${user.first_name} ${user.last_name}`);
   
  };
render() {
const { userList } = this.state;

return (
 <div >
   <div>
     <List component="nav">
       {userList.map((user) => (
         <div key={user._id}>
           <ListItem>
             <Button
             onClick={() => {
               this.handleUserClick(user); 
           }}
               component={Link}
               to={`/users/${user._id}`}
               className="ButtonStyle" 
             >
               {`${user.first_name} ${user.last_name}`}
             </Button>
           </ListItem>
           <Divider />
         </div>
       ))}
     </List>
   </div>
   <div style={{ width: '70%' }}>
     {this.props.children}
   </div>
 </div>
);
}
}


export default UserList;
