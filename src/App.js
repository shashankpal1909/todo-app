import React, { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Form,
  Modal,
  Nav,
  Navbar,
  ProgressBar
} from "react-bootstrap";
import "./App.css";
import DoneIcon from '@material-ui/icons/Done';
import QueueIcon from '@material-ui/icons/Queue';

if (localStorage.getItem(btoa("todo-list")) === null) {
  localStorage.setItem(btoa("todo-list"), "[]");
}

function App() {
  const [todoArr, setTodoArr] = useState(JSON.parse(localStorage.getItem(btoa("todo-list"))));
  const [modalShow, setModalShow] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const addTodo = (newTodo) => {
    if (checkDuplicate(newTodo) !== -1) {
      setModalMsg("Seems like you already added that TODO!");
      return setModalShow(true);
    }
    setTodoArr([...todoArr, { todo: newTodo, completed: false }]);
    localStorage.setItem(btoa("todo-list"), JSON.stringify([...todoArr, { todo: newTodo, completed: false }]));
  };

  const delTodo = (todo) => {
    setTodoArr(
      todoArr.filter((item) => {
        return item.todo !== todo;
      })
    );
    localStorage.setItem(btoa("todo-list"),
      JSON.stringify(
        todoArr.filter((item) => {
          return item.todo !== todo;
        })
      ));
  };

  const handleSubmit = () => {
    const newTodo = document.getElementsByClassName("todo-input")[0].value;
    if (newTodo === "") {
      setModalMsg("Enter a item to Add!");
      return setModalShow(true);
    }
    addTodo(newTodo);
    document.getElementsByClassName("todo-input")[0].value = "";
  };

  const checkDuplicate = (todo) => {
    return todoArr.findIndex(
      (item) => item.todo.toLowerCase() === todo.toLowerCase()
    );
  };

  const sortArr = (arr) => {
    let newArr = arr;
    newArr.sort((a, b) => {
      const str_a = a.todo.toLowerCase();
      const str_b = b.todo.toLowerCase();
      if (str_a < str_b) {
        return -1;
      }
      if (str_a > str_b) {
        return 1;
      }
      return 0;
    })
    return newArr;
  }

  const showHelp = () => {
    setModalMsg("This is some useful help only for you!")
    setModalShow(true);
  }

  const getProgress = () => {
    let count = 0;
    todoArr.forEach((todo) => {
      if (todo.completed) count++;
    })
    return count / todoArr.length * 100;
  }


  // TodoListItem Component --------------------
  function TodoListItem({ todo }) {
    const index = todoArr.findIndex((item) => item.todo === todo);
    const [variant, setVariant] = useState(
      todoArr[index].completed ? "success" : "warning"
    );

    const handleClick = () => {
      const newTodoArr = todoArr.map((item) => {
        if (item.todo === todo) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      });
      setTodoArr(newTodoArr);
      localStorage.setItem(btoa("todo-list"), JSON.stringify(newTodoArr));
      setVariant(variant === "warning" ? "success" : "warning");
    };

    return (
      <div>
        <Alert
          style={{
            marginBottom: "10px",
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            wordBreak: "break-all"
          }}
          variant={variant}
          onClose={() => delTodo(todo)}
          dismissible
        >
          <Badge
            variant="secondary"
            onClick={handleClick}
            style={{
              userSelect: "none",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            {variant === "success"
              ? <div><DoneIcon fontSize={"inherit"} style={{ marginRight: "1px" }} />DONE</div>
              : <div><QueueIcon fontSize={"inherit"} style={{ marginRight: "2px" }} />TODO</div>}
          </Badge>
          {todo}
        </Alert>
      </div>
    );
  }
  // TodoListItem Component --------------------


  // MessageModal Component --------------------
  function MessageModal(props) {
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Message
					</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 style={{ marginBottom: "0" }}>{props.msg}</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          			</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  // MessageModal Component --------------------


  // SectionHeading Component --------------------
  function SectionHeading({ msg }) {
    return (
      <Badge
        variant="secondary"
        style={{
          userSelect: "none",
          width: "100%",
          marginBottom: "5px"
        }}
      >
        {msg}
      </Badge>
    );
  }
  // SectionHeading Component --------------------


  return (
    <div className="App">
      <Navbar
        bg="dark"
        variant="dark"
        expand="sm"
        collapseOnSelect
        style={{ marginBottom: "10px" }}
      >
        <Navbar.Brand>
          <h3 style={{
            margin: "0",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "pointer",
            userSelect: "none"
          }}>
            TODO List
					</h3>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto" />
          <Form inline>
            <Nav.Link href="#" style={{ padding: "0.5rem 0" }}>
              <Button variant="outline-light" onClick={showHelp}>Help</Button>
            </Nav.Link>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <MessageModal
        msg={modalMsg}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />

      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group
          style={{
            display: "flex",
            margin: "0 10px",
          }}
        >
          <Form.Control
            type="text"
            placeholder="New TODO Item"
            className="todo-input"
          />
          <Button
            style={{ marginLeft: "10px" }}
            variant="outline-primary"
            type="submit"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </Form.Group>
      </Form>
      <div style={{ margin: "10px" }}>
        {todoArr.length === 0 && (
          <div>
            <Alert
              style={{
                marginBottom: "10px",
                textAlign: "center",
                userSelect: "none"
              }}
              variant="info"
            >
              Lets add your first TODO!
            	</Alert>
          </div>
        )}
        {todoArr.length !== 0 &&
          <div>
            <SectionHeading msg="Your Progress" />
            <ProgressBar
              animated
              now={getProgress()}
              label={`${getProgress().toFixed(2)}%`}
              style={{ marginBottom: "10px", userSelect: "none" }}
            />
          </div>
        }
        {getProgress() < 100 && <SectionHeading msg="Incomplete Tasks" />}
        {
          // eslint-disable-next-line
          sortArr(todoArr).map((todo) => {
            if (!todo.completed)
              return <TodoListItem todo={todo.todo} key={todo.todo} />;
          })
        }
        {getProgress() > 0 && <SectionHeading msg="Completed Tasks" />}
        {
          // eslint-disable-next-line
          sortArr(todoArr).map((todo) => {
            if (todo.completed)
              return <TodoListItem todo={todo.todo} key={todo.todo} />;
          })
        }
      </div>
    </div >
  );
}

export default App;
