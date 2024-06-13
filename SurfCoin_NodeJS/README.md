# Group task
   In this task,   you must develop a blockchain that handles a fictitious cryptocurrency and handles transactions. 
 
+
# Technical description
 ### The server application 
 (Back-End) Node. js must be used as the programming language for the Blockchain (the server part).
 - The server part must be developed according to the MVC design pattern. This means that each endpoint must be placed in its own controller module. 
 - Route management must be in its own module.
 - There must be endpoints (url) to be able
   - > to list the blockchain, 
   - > add new blocks to the blockchain. 
   - > Validate the blockchain and the blocks in the blockchain. 
   - > Add transactions and be able to make a "mine" for all transactions.
   - > If there is time, it is good if a "consensus" algorithm is developed that synchronizes the blockchains of several nodes.
 ### The client application
   - should be developed either as a pure HTML +CSS +JavaScript or with React + vite. 
   - The same basic requirement is here that the structure of the application must follow accepted code standards.
   - Via the client application it must be possible 
     - >  to list blocks in a blockchain,
     - >  retrieve a block from the blockchain.
     - >  to add a new transaction.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh