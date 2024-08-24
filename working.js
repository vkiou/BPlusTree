
class Node {
    constructor(isLeaf = false) {
        this.isLeaf = isLeaf;
        this.keys = [];                                                     // The values inside the node.
        this.children = [];
        this.parent = null;
        this.next = null;                                                   // These only exist
        this.previous = null;                                               // for leaf nodes!
    }
}
  
  
class BPlusTree {
    constructor(order) {
        this.order = order;
        this.root = null;
        this.isEmpty = true;
        this.valuesInTree = [];
    }

    // Return the value if it exists in the B+ Tree, else null
    find(value){
        let result = null;
        let node = this.root;                                               // Find the leaf where the value should be in.
        while(!node.isLeaf){
            let i = 0;
            while(i < node.keys.length){
                    if(value <= node.keys[i]){
                        if(value == node.keys[i]){
                            node = node.children[i+1];
                            break;
                        }
                        else{
                            node = node.children[i];
                            break;
                        }
                    }
                    if(i == node.keys.length - 1){
                        node = node.children[i+1];
                        break;
                    }
                    i++;    
            }  
        }
        let j = 0;                                                          // Search the value in the leaf.
        while(j < node.keys.length){
            if(value == node.keys[j]){
                result = value;                                             // If it exists, return the value.
            }
            j++;
        }
        return result;                                                      // Else, return null.
        
    }


    // Find the values in the tree that are in range [lower,upper]
    findRange(lower,upper){
        if(lower > upper){
            window.alert('The lower value should be smaller or equal to the upper value of your range!');
            return;
        }
        let result = [];
        let node = this.root;
        while(!node.isLeaf){                                                // Find the leaf where lower should be in.
            let i = 0;
            while(i < node.keys.length){
                if(lower <= node.keys[i]){
                    if(lower == node.keys[i]){
                        node = node.children[i+1];
                        break;
                    }
                    else{
                        node = node.children[i];
                        break;
                    }
                }
                i++;
            }
            if(i == node.keys.length){
                node = node.children[i];
            }
        }
        let j = 0;
        while(j < node.keys.length){
            if(lower <= node.keys[j]){
                break;
            }
            j++;
            if(j == node.keys.length){
                node = node.next;
                j = 0;
                break;
            }
        }
        let done = false;
        while(done != true){
            if(j <= node.keys.length-1 && node.keys[j] <= upper){
                result.push(node.keys[j]);
                j++;
            }
            else if(j <= node.keys.length-1 && node.keys[j] > upper){
                done = true;
            }
            else if(j > node.keys.length-1 && node.next != null){
                node = node.next;
                j = 0;
            }
            else{
                done = true;
            }
        }
        console.log(result); 
        return result;
    }

    // Insert a value to the B+ Tree
    insert(value) {                                                     
        if (this.isEmpty) {                                                 // If the tree is empty,
            this.root = new Node(true);                                     // create the root.
            this.root.keys.push(value);
            this.isEmpty = false;
        }
        else if(this.find(value) != null){                                  // If the value already exists, don't insert it.
            window.alert("The value '" + value + "' already exists in the B+ Tree!");
        }
        else {
            let node = this.root;                                           // Find the leaf where the value should be in.
            while(!node.isLeaf){
            let i = 0;
            while(i < node.keys.length){
                    if(value <= node.keys[i]){
                        if(value == node.keys[i]){
                            node = node.children[i+1];
                            break;
                        }
                        else{
                            node = node.children[i];
                            break;
                        }
                    }
                    if(i == node.keys.length - 1){
                        node = node.children[i+1];
                        break;
                    }
                    i++;    
                } 
            }
            if (node.keys.length < this.order - 1) {                         // If the leaf has enough space left,
                this.insertInLeaf(node, value);                              // then insert the value in the leaf.
            } 
            else {                                                           // Else, find the proper position where the value should be in
                if (value < node.keys[0]) {                                  // If the value is smaller than the first element of the
                    node.keys.unshift(value);                                // leaf, then insert it first.       
                } 
                else if(value > node.keys[node.keys.length - 1]){            // If the value is larger than the last element of the    
                    node.keys.push(value);                                   // leaf, then insert it last.       
                }
                else {                                                       // Else, find the proper position where the value should be in.
                    let i = 1;                                                      
                    while (i < node.keys.length) {                                  
                        if (value < node.keys[i]) {
                            let tempnode = [];
                            let k = node.keys.length;
                            while (k > i) {
                                tempnode.push(node.keys.pop());
                                k--;
                            }
                            node.keys.push(value);
                            let j = tempnode.length;
                            while (j > 0) {
                                node.keys.push(tempnode.pop());
                                j--;
                            }
                            break;
                        }
                        i++;
                    }
                }
                let tempnode = new Node(true);                              // Split the leaf into two leaves
                let j = Math.ceil(this.order / 2);
                while (j <= node.keys.length) {
                    tempnode.keys.unshift(node.keys.pop());
                    j++;
                }
                tempnode.parent = node.parent;
                this.insertInParent(node, tempnode.keys[0], tempnode);      // and insert in the parent of the two leaves the smallest value of the right leaf.
            }
        }
        this.valuesInTree.push(value);
    }

    //Insert a value to the corresponding leaf of the B+ Tree
    insertInLeaf(node, value) { 
        if (value < node.keys[0]) {                                         // Find the proper position where the value should be in (like above).
            node.keys.unshift(value);                                       
        } 
        else if(value > node.keys[node.keys.length - 1]){                   
            node.keys.push(value);                                          
        }
        else {
            let i = 1;                                                      
            while (i < node.keys.length) {                                  
                if (value < node.keys[i]) {
                    let tempnode = [];
                    let k = node.keys.length;
                    while (k > i) {
                        tempnode.push(node.keys.pop());
                        k--;
                    }
                    node.keys.push(value);
                    let j = 0;
                    while (j <= tempnode.length) {
                        node.keys.push(tempnode.pop());
                        j++;
                    }
                    break;
                }
                i++;
            }
        }
    }

    //Insert a value from a leaf to its parent and if the parent has more than n-1 keys, then split it 
    insertInParent(node1, value, node2) {
        if (node1 === this.root) {                                          // If the node1 is the root of the B+ Tree,
            let newroot = new Node();                                       // create a new root
            newroot.keys.push(value);
            newroot.children.push(node1);                                   // and make node1 and node2 its children.
            newroot.children.push(node2);
            this.root = newroot;
            node1.parent = this.root;
            node2.parent = this.root;
            if(node1.isLeaf){
                node1.next = node2;
                node2.previous = node1;
            }
            return;
        }
        let p = node1.parent;                                               // p is the parent of node1.
        if (p.keys.length < this.order - 1) {                               // If the parent of node1 has enough space left,
            if (value < p.keys[0]) {                                        // find the proper position of p where the value should be in (like above).
                p.keys.unshift(value);                                       
            } 
            else if(value > p.keys[p.keys.length - 1]){                   
                p.keys.push(value);                                          
            }
            else {
                let i = 1;                                               
                while (i < p.keys.length) {                                  
                    if (value < p.keys[i]) {
                        let tempnode = [];
                        let k = p.keys.length;
                        while (k > i) {
                            tempnode.push(p.keys.pop());
                            k--;
                        }
                        p.keys.push(value); 
                        let j = tempnode.length;
                        while (j > 0) {
                            p.keys.push(tempnode.pop());
                            j--;
                        } 
                        break;
                    }
                    i++;
                }
            }
            if (node2.keys[0] > p.children[p.children.length - 1].keys[p.children[p.children.length - 1].keys.length - 1]) {    // find the proper position of children of p where node2 should be in (like above).
                p.children.push(node2)                                       
            } 
            else {
                let i = 0;
                while(i < p.children.length){
                    if(p.children[i] == node1){
                        let tempnode = [];
                        let k = p.children.length;
                        while (p.children.length > i+1) {
                            tempnode.push(p.children.pop());
                            k--;
                        }
                        p.children.push(node2);
                        let j = tempnode.length;
                        while (j > 0) {
                            p.children.push(tempnode.pop());
                            j--;
                        }
                        break;
                    }
                    i++;
                }
            }   
            if(node1.isLeaf){             
                if(node1.keys[0] > node2.keys[0]){                          // If node1 is the last node
                    if(node2.next != null){
                        node1.previous.next = node2;
                        node2.previous = node1.previous;
                    }
                    node1.previous = node2;
                    node2.next = node1;
                }
                else if(node2.keys[0] > node1.keys[0]){
                    if(node1.next != null){
                        node1.next.previous = node2;
                        node2.next = node1.next;
                    }
                    node1.next = node2;
                    node2.previous = node1;
                }
            }
        }                                                          
        else {                                                              // Else, split the parent of node1 into two nodes
            if(node1.isLeaf){              
                if(node1.keys[0] > node2.keys[0]){                          // If node1 is the last node,
                    if(node2.next != null){                         
                        node1.previous.next = node2;                        // put node2 before node1 fixing the next and previous pointers
                        node2.previous = node1.previous;
                    }
                    node1.previous = node2;
                    node2.next = node1;
                }
                else if(node2.keys[0] > node1.keys[0]){                     // If node2 is the last node,
                    if(node1.next != null){
                        node1.next.previous = node2;                        // put node1 before node2 fixing the next and previous pointers
                        node2.next = node1.next;
                    }
                    node1.next = node2;
                    node2.previous = node1;
                }
            }
            if (value < p.keys[0]) {                                         // Find the proper position of p where the value should be in (like above).
                    p.keys.unshift(value);                                       
                } 
                else if(value > p.keys[p.keys.length - 1]){                   
                    p.keys.push(value);                                          
                }
                else {
                    let i = 1;                                                      
                    while (i < p.keys.length) {                                  
                        if (value < p.keys[i]) {
                            let tempnode = [];
                            let k = p.keys.length;
                            while (k > i) {
                                tempnode.push(p.keys.pop());
                                k--;
                            }
                            p.keys.push(value);
                            let j = 0;
                            while (j <= tempnode.length) {
                                p.keys.push(tempnode.pop());
                                j++;
                            }
                            break;
                        }
                        i++;
                    }
                }
                if (node2.keys[0] > p.children[p.children.length - 1].keys[p.children[p.children.length - 1].keys.length - 1]) {    // find the proper position of children of p where node2 should be in (like above).                                     // find the proper position of p where node2 should be in (like above).
                    p.children.push(node2);                                   
                } 
                else {
                    let i = 0;
                    while(i < p.children.length){
                        if(p.children[i] == node1){
                            let tempnode = [];
                            let k = p.children.length;
                            while (p.children.length > i+1) {
                                tempnode.push(p.children.pop());
                                k--;
                            }
                            p.children.push(node2);
                            let j = tempnode.length;
                            while (j > 0) {
                                p.children.push(tempnode.pop());
                                j--;
                            }
                            break;
                        }
                        i++;
                    }
                } 
                let newnode = new Node();                                    // This is the new right sibling of p, N',
                newnode.parent = p.parent;
                let j = p.keys.length;
                while (j > Math.ceil(this.order / 2) - 1) {                  // which will have the values from K(ceil(n+1)/2)+1 till Kn.
                    newnode.keys.unshift(p.keys.pop());
                    j--;
                }
                let newvalue = newnode.keys.shift();
                let k = p.children.length;
                while(p.children.length > k/2){                              // Add the values from p to N' that are children of N'.
                    let newkid = p.children.pop();
                    newnode.children.unshift(newkid);
                    newkid.parent = newnode;
                }
                this.insertInParent(p, newvalue, newnode);                   // Repeat the process for the siblings p and N' with the value K'
        }
    }

    // Delete a value from the B+ Tree if it exists.                          
    delete(value){
        if(this.find(value) == null){
            window.alert("The value '" + value + "' doesn't exist in the B+ Tree!");
        }
        /*else if(this.isEmpty){
            window.alert("The B+ Tree is empty!");
        }*/
        else{
            let node = this.root;                                            // Find the leaf where the value should be in.
            while(!node.isLeaf){
            let i = 0;
            while(i < node.keys.length){
                    if(value <= node.keys[i]){
                        if(value == node.keys[i]){
                            node = node.children[i+1];
                            break;
                        }
                        else{
                            node = node.children[i];
                            break;
                        }
                    }
                    if(i == node.keys.length - 1){
                        node = node.children[i+1];
                        break;
                    }
                    i++;    
                } 
            }
            this.deleteEntry(node,value);
        }
    }

    deleteEntry(node,value){
        if(node.isLeaf && node == this.root && node.keys.length == 1 && node.keys[0] == value){
            this.isEmpty = true;
            return;
        }
        let j = 0;                                                           // Remove the value from the leaf
        while(j < node.keys.length){
            if(value == node.keys[j]){
                while(j <= node.keys.length - 1){
                    node.keys[j] = node.keys[j+1];
                    j++;
                }
                node.keys.pop();
            }
            j++;
        }
        if(node == this.root && node.children.length == 1){                  // If the node is the root and has only 1 child,
            this.root = node.children[0];                                    // make the child the tree's root
            this.root.parent = null;                                         // and delete the node.
            node.keys = [];                                               
            node.children = [];
            if(this.root.children.length == 0){
                this.root.isLeaf = true;
            }
        }
        else if( ( node.isLeaf && node.keys.length < Math.ceil((this.order-1)/2) )                               // If node has too few values.
                || ( this.root != node && !node.isLeaf && node.children.length < Math.ceil(this.order/2)) 
        ){
            let key = 0;
            let node1 = new Node();                                                                     
            let i = 0;
            if(node.parent == null){
                return;
            }
            while(i < node.parent.children.length - 1){
                if(node.parent.children[i] == node){
                    if(node.parent.children[i+1] != null){           // node1 is the right sibling of node
                        node1 = node.parent.children[i+1];
                        key = node.parent.keys[i];                   // and key is the value of their parent between node and node1
                        break;
                    }
                    else {                                           // node1 is the left sibling of node
                        node1 = node.parent.children[i-1];
                        key = node.parent.keys[i-1];                 // and key is the value of their parent between node and node1
                        break;
                    }
                                                
                }
                i++;
                if(i == node.parent.children.length - 1){
                    node1 = node.parent.children[i-1];
                    key = node.parent.keys[i-1];                     // and key is the value of their parent between node and node1
                    break;
                }
            }
            if( ( node.isLeaf && node.keys.length + node1.keys.length <= this.order - 1 )
                || ( !node.isLeaf && node.children.length + node1.children.length <= this.order) 
            ){                                                       // If the values from node and node1 fit into one, merge them.
                if(node.next == node1){                              // If node is the predecessor of node1,
                    let node2 = new Node();                          // then swap node and node1.
                    node2 = node1;
                    node1 = node;
                    node = node2;
                }   
                if(!node.isLeaf){                                    // If node is not a leaf,
                    if(node1.keys[0] > key){
                        node1.keys.unshift(key);                     // add the key
                    }
                    else{
                        node1.keys.push(key);                        // at the right posiiton
                    }
                    while(node.keys.length > 0){                     // and all of its values to node1.
                        node1.keys.push(node.keys.shift())
                    }
                }
                else{
                    while(node.keys.length > 0){                     // Else, add all of its values to node1 
                        node1.keys.push(node.keys.shift())
                    }
                    node1.next = node.next;
                    if(node.next != null){
                        node.next.previous = node1;                  // and put node1 before node2 fixing the next and previous pointers.
                    }     
                }
                if (node == node.parent.children[0]) {               // Also, remove node from its parent's children (like above).
                    node.parent.children.shift();                                       
                } 
                else if(node == node.parent.children[node.parent.children.length - 1]){                   
                    node.parent.children.pop();                                          
                }
                else {
                    let i = 1;                                                      
                    while (i < node.parent.children.length) {                                  
                        if (node == node.parent.children[i]) {
                            let tempnode = [];
                            let k = node.parent.children.length;
                            while (k > i + 1) {
                                tempnode.push(node.parent.children.pop());
                                k--;
                            }
                            node.parent.children.pop();
                            let j = 0;
                            while (j < tempnode.length) {
                                node.parent.children.push(tempnode.pop());
                                j++;
                            }
                            break;
                        }
                        i++;
                    }
                }
                // THE ONLY THING I DONT KNOW IF IT WORKS
                if(node.children.length!=0){                         // Put all the children of node, if it has any, as children of node1.
                    if(node.children[0].keys[0] < node1.children[0].keys[0]){      // If node is a predecessor of node1.
                        if(node.children[0].isLeaf){
                            node1.children[0].previous = node.children[node.children.length - 1];
                            node1.children[node1.children.length - 1].next = null;
                        }
                        while(node.children.length > 0){                 
                            let m = node.children.pop();
                            node1.children.unshift(m);
                            m.parent = node1;
                        }
                    }
                    else if(node1.children[0].keys[0] < node.children[0].keys[0]){ // If node1 is a predecessor of node.
                        if(node.children[0].isLeaf){
                            node.children[0].previous = node1.children[node1.children.length - 1];
                            node.children[node.children.length - 1].next = null;
                        }
                        while(node.children.length > 0){
                            let m = node.children.shift();
                            node1.children.push(m);
                            m.parent = node1;
                        }
                    }
                }
                this.deleteEntry(node1.parent,key);                  // Delete the key from node1's parent.
            }                                         
            else{                                                    // Else, redistribute the values from node and node1.
                if(node1.keys[node1.keys.length - 1] < node.keys[0]  // Node1 is a predecessor of node.
                    || (node.keys.length == 0 && node1.keys[node1.keys.length - 1] < key)
                ){                                      
                    if(!node.isLeaf && this.root != node){           // If node is an internal node,
                        let m = node1.keys.pop();                    // remove the last child from node1,
                        node.keys.unshift(key);                      // add key as the first value of node
                        let i = 0;
                        while(i < node.parent.keys.length){          //and replace key from the parent of node with the last value of node1. 
                            if(node.parent.keys[i] == key){
                                node.parent.keys[i] = m;
                                break;
                            }
                            i++;
                        }
                        let n = node1.children.pop();
                        node.children.unshift(n);
                        n.parent = node;
                    }
                    else{                                                   
                        let m = node1.keys.pop();                    // remove the last child from node1,
                        node.keys.unshift(m);                        // add key as the first value of node
                        let i = 0;
                        while(i < node.parent.keys.length){          //and replace key from the parent of node with the last value of node1. 
                            if(node.parent.keys[i] == key){
                                node.parent.keys[i] = m;
                            }
                            i++;
                        }
                    }
                }
                else if(node.keys[node1.keys.length - 1] < node1.keys[0]    // Node is a predecessor of node1.
                    || (node.keys.length == 0 && key < node1.keys[0])
                ){                                                       
                    if(!node.isLeaf && this.root != node){           // If node is an internal node,
                        let m = node1.keys.shift();                  // remove the prelast child from node1,
                        node.keys.push(key);                         // add key as the first value of node
                        let i = 0;
                        while(i < node.parent.keys.length){          //and replace key from the parent of node with the last value of node1. 
                            if(node.parent.keys[i] == key){
                                node.parent.keys[i] = m;
                                break;
                            }
                            i++;
                        }
                        let n = node1.children.shift();
                        node.children.push(n);
                        n.parent = node;
                    }
                    else{  
                        let m = node1.keys.shift();                  // remove the last child from node1,
                        node.keys.push(m);                           // add key as the first value of node
                        let i = 0;
                        while(i < node.parent.keys.length){          //and replace key from the parent of node with the last value of node1.
                            if(node.parent.keys[i] == key){
                                node.parent.keys[i] = m;
                            }
                            i++;
                        } 
                    }
                    let k = 0;
                        while(k < node.parent.keys.length){          //Update parent key if the new smallest value
                            if(node.keys[node.keys.length - 1] == node.parent.keys[k]){  // of the leaf is smaller than the value of its parent.
                                node.parent.keys[k] = node1.keys[0];                                          
                            }
                            k++;
                        }
                }
            }
        }
        else{
            let i = 0;
            if(node.parent != null && node.parent.keys.length !=0 ){
                while(i < node.parent.keys.length){                      //Update parent key if the new smallest value
                    if(node.parent.keys[i] == value){                    // of the leaf is smaller than the value of its 
                        node.parent.keys[i] = node.keys[0];              // parent
                    }
                    i++;
                }
            }
        }
    }

    // Clears the tree from all the values
    clearTree(){
        if (this.isEmpty) {
            window.alert("The B+ Tree is Empty!");
            return;
        }
        while(this.valuesInTree.length != 0){
            this.delete(this.valuesInTree.pop());
        }
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = ""; // Clear previous content
        canvas.innerHTML += ("---------------------------------- The B+ Tree ----------------------------------<br>");
        canvas.innerHTML += ("---- Starting from the root, we traverse the tree from top to bottom ----<br>");
        canvas.innerHTML += ("------ and for each height, we traverse the nodes from left to right ------<br>");
    }

    // Prints the leaves of the B+ Tree on the console
    printTreeConsole() {
        if (this.isEmpty) {
            console.log("The B+ Tree is Empty!");
            return;
        }
        console.log("------------------------------ The B+ Tree ------------------------------");
        console.log("---- Starting from the root, we traverse the tree from top to bottom ----");
        console.log("----- and for each height, we traverse the nodes from left to right -----");
        const queue = [this.root];
        let clc = null;
        let height = 0;
        while (queue.length > 0) {
            let current = queue.shift();
            let nodes = "" ;
            if(current === this.root){
                nodes = nodes + "height " + height +  ": " + current.keys + " | " + "isLeaf: " + current.isLeaf + " | " + "parent: " + null + " | ";
            }
            else{
                nodes = nodes + "height " + height +  ": " + current.keys + " | " + "isLeaf: " + current.isLeaf + " | " + "parent: " + current.parent.keys + " | ";
            }
            if (!current.isLeaf) {
                if(current === this.root){
                    height++;
                    clc = current.children[current.children.length - 1];
                }
                if(current === clc){
                    height++;
                    clc = clc.children[clc.children.length - 1];
                }
                let i = 0;
                while (i < current.children.length) {
                    queue.push(current.children[i]);
                    i++;
                }
            }
            console.log(nodes);
        }
    }

    // Prints the leaves of the B+ Tree on the canvas
    printCanvas() {
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = ""; // Clear previous content
        canvas.innerHTML += ("---------------------------------- The B+ Tree ----------------------------------<br>");
        canvas.innerHTML += ("---- Starting from the root, we traverse the tree from top to bottom ----<br>");
        canvas.innerHTML += ("------ and for each height, we traverse the nodes from left to right ------<br>");
        if (this.isEmpty) {
            window.alert("The B+ Tree is Empty!");
            return;
        }
        const queue = [this.root];
        let clc = null;
        let height = 0;
        while (queue.length > 0) {
            let current = queue.shift();
            let nodes = "" ;
            if (current === this.root) {
                nodes = `height ${height}: ${current.keys ? current.keys.join(", ") : "undefined"} | isLeaf: ${current.isLeaf} | parent: null | `;
            } else {
                nodes = `height ${height}: ${current.keys ? current.keys.join(", ") : "undefined"} | isLeaf: ${current.isLeaf} | parent: ${current.parent && current.parent.keys ? current.parent.keys.join(", ") : "undefined"} | `;
            }
            if (!current.isLeaf) {
                if(current === this.root){
                    height++;
                    clc = current.children[current.children.length - 1];
                }
                if(current === clc){
                    height++;
                    clc = clc.children[clc.children.length - 1];
                }
                let i = 0;
                while (i < current.children.length) {
                    queue.push(current.children[i]);
                    i++;
                }
            }
            canvas.innerHTML += nodes + "<br>";
        }
    }

}
  