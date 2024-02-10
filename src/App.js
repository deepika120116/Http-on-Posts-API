import React, { Component } from "react";
import "./App.css";
//import axios from "axios"; moving axios to httpService.js
import http from './services/httpService';
//import config from './config.json';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

//moving to config file
 const apiEndPoint = "https://jsonplaceholder.typicode.com/posts";
//Moving to http service
// //axios.interceptors.response.use(success,error)-template
// axios.interceptors.response.use(null, error => {
//   console.log("INTERCEPTOR BLOCK");
//   const expectedError = (error.response && error.response >= 400 && error.response < 500);
//   if (!expectedError) {
//      console.log("logging in the error",error);
//       alert("Sorry, unexpected error occured");
//   }
//   return Promise.reject(error);
// });

class App extends Component {
  
  state = {
    posts: []
  };

async componentDidMount(){
    //const promise = axios.get("https://jsonplaceholder.typicode.com/posts");//get request to fetch data from server
    //console.log(promise);
    //const response = await promise;//we should use async keyword before the method when we use "await" keyword
    //console.log(response);
    //we can rename all the above code as
  // const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
  //we want the "data" from this response.data so we will destructure it

    //const { data: posts } = await axios.get(apiEndPoint); replacing axios with HTTP
  
  //const { data: posts } = await http.get(apiEndPoint); replacing URL from config file
    const { data: posts } = await http.get(apiEndPoint);

  // if we dont rename to posts, the result is not displayed cox "Posts" is specified in "state"
  this.setState({ posts });
  };

  handleAdd = async() => {//async is not applied to "handleAdd" since it is a property, async should be applied only to method
    //pesimistic method
    const obj = { title: "new post", body: "This is testing my new post" };//creating an object to post/insert to server
    const { data: post } = await http.post(apiEndPoint, obj);//2 properties, 1st URL & next obj
    //console.log(post);
  
    const posts = [ post, ...this.state.posts ];//to display in the table
    //the new data is pushed to d front of the table, then concatinated to the 100 posts from server
    this.setState({ posts });


  };

  handleUpdate = async post => {
    //Pesimistic approach
    // //console.log("Update", post);
    post.title = "UPDATED the Post";//field to be updated
    // const { data } = await axios.patch(apiEndPoint+'/'+'{post.id}', post.title);//to patch or update only one field
    // console.log({ data });//updated only in the memory, to update the table, we have to operate via 'setState'
    await http.put(apiEndPoint + '/' + post.id, post);//we have to get the entire Post as 2nd attribute
    const posts = [...this.state.posts];//converting to array & creating clone so it wil be easy to find index
    const index = posts.indexOf(post);//getting the index of the post
    posts[index] = { ...post };//creating new object by cloning,The posts array is updated with the new object at the correct index.
    this.setState({ posts });

    //optimistic approach
    // const orginialPosts = this.state.posts;
    // const posts = [...this.state.posts];
    // const index = posts.indexOf(post);
    // posts[index] = { ...post };
    // this.setState({ posts });
    // try {
    //   //await axios.put(apiEndPoint + '/' + post.id); replacing axios with http
    //   await http.put(config.apiEndPoint + '/' + post.id);
    // }
    // catch (er) {
    //   alert("Sorry, unexpected error occured before updating");
    //    this.setState({ posts:orginialPosts });
    // }
    
  };

  handleDelete = async post => {
    // pessimistic approach
    // await axios.delete(apiEndPoint + '/' + post.id);//for delete, u dont need 2nd argumnent, URL is enough with filtering id
    // const posts = this.state.posts.filter(p => p.id !== post.id);//filtering posts where the id of the post should not b there in the filtered display
    // this.setState({ posts });

    //optimistic approach
    const originalPosts = this.state.posts;// clone the original post,so that we can revert if any error occurs
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });
    try {
      //await axios.delete(apiEndPoint + '/99990') modifying for simulating expected error
      //await axios.delete(apiEndPoint + '/'+post.id); replacing axios with http

      await http.delete(apiEndPoint + '/'+post.id);
      //throw new Error("");
    }
  catch(ex)
    {
      console.log("CATCH BLOCK");
      if (ex.response && ex.response.status === 404) {
        alert("Sorry, the item has already been deleted");//specific msg since it is expected error
      }
      // else { moving this block to globally declare in the INTERCEPTOR
      //   console.log("logging in the error",ex);
      //   alert("Sorry, unexpected error occured");
        
      // }
      this.setState({ posts:originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer/>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
