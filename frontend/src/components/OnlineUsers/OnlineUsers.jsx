import "./OnlineUsers.css";

function OnlineUsers({
  onlineUsers,
  currentUser,
}) {

  const filteredUsers =
    onlineUsers.filter(
      (user) =>
        user.username !== currentUser
    );

  return (

    <div className="online-users">

      <h3>
        Online Users
      </h3>

      <div className="users-list">

        {
          filteredUsers.length > 0 ? (

            filteredUsers.map(
              (user, index) => (

                <div
                  className="online-user"
                  key={index}
                >

                  <div className="user-avatar">

                    {
                      user.username
                      .charAt(0)
                      .toUpperCase()
                    }

                  </div>

                  <span>
                    {user.username}
                  </span>

                  <div className="online-dot"></div>

                </div>

              )
            )

          ) : (

            <p className="no-users">
              No other users online
            </p>

          )
        }

      </div>

    </div>

  );
}

export default OnlineUsers;