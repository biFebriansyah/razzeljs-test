export const customStyles = {
    control: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        width: 309,
        border: "none",
        borderBottom: "2px solid #2980b9",
        outline: "none",
        textAlign: "right",
        borderRadius: 0,
        backgroundColor: "inherit",
        boxShadow: "none",
        "&:hover": {
            borderColor: "#1ab667",
        },
    }),
    input: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        textAlign: "right",
    }),
    valueContainer: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        justifyContent: "flex-end",
    }),
    dropdownIndicator: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        color: "#788188",
    }),
}

export const selectGenStyle = {
    control: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        border: "none",
        borderBottom: "2px solid #2980b9",
        outline: "none",
        textAlign: "right",
        borderRadius: 0,
        // backgroundColor: "inherit",
        backgroundColor: "#e0eaec",
        fontSize: "20px",
        boxShadow: "none",
        "&:hover": {
            borderColor: "#1ab667",
            zIndex: 999999,
        },
    }),
    menu: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        zIndex: 999999,
    }),
    menuList: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        zIndex: 999999,
    }),
    menuPortal: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        zIndex: 999999,
    }),
    input: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        textAlign: "right",
    }),
    valueContainer: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        justifyContent: "flex-end",
    }),
    dropdownIndicator: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        color: "#788188",
    }),
}

export const selectListen = {
    control: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        border: "none",
        borderBottom: "2px solid #1ab667",
        outline: "none",
        borderRadius: 0,
        backgroundColor: "inherit",
        fontSize: "18px",
        boxShadow: "none",
    }),
    singleValue: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        color: "inherit",
    }),
    menu: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        backgroundColor: "#0d1215",
        borderRadius: 0,
    }),
    option: (styles, { isSelected }) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        backgroundColor: isSelected ? "#1ab667" : null,
        color: "white",
    }),
}

export const selectProfile = {
    control: (styles, state) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        outline: "none",
        minHeight: "34px",
        height: "34px",
        borderRadius: "2px",
        backgroundColor: "inherit",
        boxShadow: "none",
        borderColor: state.isFocused ? "#545ca6" : "none",
        // "&:hover": {
        //     borderColor: "#545ca6",
        // },
    }),
    singleValue: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        color: "inherit",
    }),
    menu: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        marginTop: "5px",
    }),
    option: (styles, { isSelected }) => ({
        // none of react-select's styles are passed to <Control />
        ...styles,
        backgroundColor: isSelected ? "#545ca6" : null,
    }),
}
