const { render, html, useState, useEffect } = Rimax;

const [todos, setTodo] = useState([]);

const [sort,setSort]=useState("Date↓")
const sortByDate=(a,b)=>{
    if(new Date(a.date).getTime()>new Date(b.date).getTime()) return 1
      if(new Date(a.date).getTime()<new Date(b.date).getTime()) return -1
      return 0
  }
const todosFiltered=todos.get(tdos=>tdos.sort((a,b)=>{
    if(sort.value=="Date↑"){
      return sortByDate(a,b)
    }else if(sort.value=="Date↓"){
      return sortByDate(b,a)
    }else if(sort.value=="A-Z↓"){
      return a.task.localeCompare(b.task)
    }else if(sort.value=="A-Z↑"){
      return b.task.localeCompare(a.task)
    }
    return 0
  }),[sort])
const updateTodo = (tdos) => {
  if (Array.isArray(tdos)) {
    setTodo(tdos);
  } else {
    console.log(tdos);
    console.warn("probleme de requete");
  }
};

function Todos() {
  useEffect(async () => {
    const tdos = await (await fetch("api/" + tabActive)).json();
    document.querySelector("#div-placeholder").remove();
    updateTodo(tdos);
  });
  const send = async (url, method = "get") =>
    await (await fetch(url, { method })).json();
  const deleteTodo = async (e, id, setActiveSpinner) => {
    e.preventDefault();
    setActiveSpinner(true);
    const url = `api/${tabActive}/${id}`;
    const tdos = await send(url, "delete");
    setTodo(tdos);
    setActiveSpinner(false);
  };
  const toggle = async (id, setActiveSpinner) => {
    setActiveSpinner(true);
    const url = `api/${tabActive}/toggle/${id}`;
    const tdos = await send(url, "PUT");
    setTodo(tdos);
    setActiveSpinner(false);
  };
  return html.map(todosFiltered, (todo) => {
    const [activeSpinner, setActiveSpinner] = useState(false);
    return html`
      <li
        class="list-group-item  justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2"
      >
        <span class="badge bg-secondary m-2"
          >${todo.get((t) => new Date(t.date).toLocaleString())}</span
        >
        <Spinner:${Spinner} activeSpinner=${activeSpinner} />

        <br />
        <a
          class="float-end"
          href="delete-todo/${todo.get((t) => t.id)}"
          data-mdb-toggle="tooltip"
          title="Remove item"
          onClick=${(e) => deleteTodo(e, todo.value.id, setActiveSpinner)}
        >
          <i class="fas fa-times text-primary btn-close "></i>
        </a>
        <div class="col d-flex">
          <div class="d-flex align-items-center col">
            <input
              class="form-check-input me-2"
              type="checkbox"
              checked=${todo.get((t) => t.completed)}
              aria-label="..."
              onClick=${() => toggle(todo.value.id, setActiveSpinner)}
            />
            <span
              style="text-decoration:${todo.get((t) =>
                t.completed ? "line-through" : "none"
              )};"
              >${todo.get((t) => t.task)}
            </span>
          </div>
        </div>
      </li>
    `;
  });
}

render(Todos, "#listTodo");

function AddTodo() {
  const [text, setText] = useState("");
  const [activeSpinner, setActiveSpinner] = useState(false);
  const addTodo = async (e) => {
    e.preventDefault();
    const task = text.value;
    setActiveSpinner(true);
    setText("");
    const tdos = await (
      await fetch("api/" + tabActive + "/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      })
    ).json();
    updateTodo(tdos);
    setActiveSpinner(false);
  };
  render(
    html`
      <div
        $if=${activeSpinner}
        class="spinner-border spinner-border-sm"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    `,
    "#spinner-add-todo"
  );
  return html`
    <div class="form-outline flex-fill">
      <input
        type="text"
        id="form3"
        class="form-control form-control-lg"
        value=${text}
      />
      <label class="form-label" for="form3"
        >What do you need to do today?</label
      >
    </div>
    <button
      type="submit"
      class="btn btn-primary btn-lg ms-2"
      onClick=${addTodo}
    >
      Ajouter
    </button>
  `;
}

render(AddTodo, "#AppForm");

function Spinner({ activeSpinner = false }) {
  const [isActive] = useState(activeSpinner);
  return html`
    <div $if=${isActive} class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `;
}

render(html`
<select
      class="form-select form-select-sm "
      aria-label=".form-select-sm example"
      value=${sort}
    >
    <option selected value="Date↓">Date↓</option>
    <option value="Date↑">Date↑</option>
      <option  value="A-Z↓">A-Z↓</option>
      <option value="A-Z↑">A-Z↑</option>
    </select>
`,"#todo-sort")