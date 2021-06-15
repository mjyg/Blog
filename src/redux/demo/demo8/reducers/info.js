let initState = {
  name: "初始名字",
  description: "初始描述",
};

export default function infoReducer(state, action) {
  if(!state) {
    state = initState
  }
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        name: action.name
      };
    case "SET_DESCRIPTION":
      return {
        ...state,
        description: action.description
      };
    default:
      return state;
  }
}