import React, { Component } from 'react';

import Spinner from '../components/spinner/Spinner';
import AuthContext from '../context/auth-context';
import BookingsList from '../components/bookings/bookings-list/BookingsList';
import BookingsChart from '../components/bookings/bookings-chart/BookingsChart';
import BookingsControls from '../components/bookings/bookings-controls/BookingsControls';

class BookingsPage extends Component {
  state = {
    loading: false,
    bookings: [],
    output: 'list'
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ loading: true });
    const requestBody = {
      query: `
        query {            
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, loading: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  deleteBookingHandler = bookingId => {
    this.setState({ loading: true });
    const requestBody = {
      query: `           
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return { bookings: updatedBookings, loading: false };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false });
      });
  };

  outputTypeHandler = output => {
    if (output === 'list') {
      this.setState({ output: 'list' });
    } else {
      this.setState({ output: 'chart' });
    }
  };

  render() {
    let content = <Spinner />;
    if (!this.state.loading) {
      content = (
        <React.Fragment>
          <BookingsControls
            activeButton={this.state.output}
            onChange={this.outputTypeHandler}
          />
          <div>
            {this.state.output === 'list' ? (
              <BookingsList
                bookings={this.state.bookings}
                onDelete={this.deleteBookingHandler}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }
    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
