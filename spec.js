var todoPageObject = function() {
  
  

  this.get = function() {
    browser.driver.get('http://localhost:8000/Downloads/todo/react/#/');
  };
  this.logTitle = function() {
    return  browser.driver.getTitle();
  
  };
  this.getTodoField = function() {
    return browser.driver.findElement(by.id('new-todo'));
  }
  this.createTodoItem = function(todo) {
    this.getTodoField().sendKeys(todo);
    ptor = protractor.getInstance()
    ptor.actions().sendKeys(protractor.Key.ENTER).perform();
  
  };
  
  this.getTodoItem = function () {
    return browser.driver.findElement(by.xpath('//*[@id="todo-list"]/li/div/label')).getText()
  }
  this.deleteTodo = function() {
    ptor = protractor.getInstance()
    ptor.actions().mouseMove(browser.driver.findElement(by.xpath('//*[@id="todo-list"]/li/div/label'))).perform();
    ptor.sleep(3000)
    if(browser.driver.findElement(by.css('#todo-list > li > div > label')).isDisplayed()) {
        browser.driver.findElement(by.xpath('//*[@id="todo-list"]/li/div/button')).click()
    
    }
   
}

    this.getTodoCount = function() {

        return browser.driver.findElement(by.id('todo-count')).getText();
    }
    
    this.completeTodo = function() {
            browser.driver.findElement(by.css('#todo-list > li > div > input')).click();
    
    }
    
    this.activeTodoList = function() {
            browser.driver.findElement(by.css('#filters > li:nth-child(3) > a')).click();
    
    }
    
    this.allTodoList = function() {
            browser.driver.findElement(by.css('#filters > li:nth-child(1) > a')).click();
    
    }
    
    this.completedTodoList = function() {
            browser.driver.findElement(by.css('#filters > li:nth-child(5) > a')).click();
    
    }
    
    this.markAllTodoList = function() {
    
        browser.driver.findElement(by.css('#toggle-all')).click(); 
    }
  
};



describe('Todo', function() {


   it('Test for creating simple todo list', function() {
    var todoPage = new todoPageObject();
    todoPage.get();    
    todoPage.createTodoItem('test');
    expect(todoPage.getTodoItem()).toEqual('test');
    todoPage.deleteTodo()
    
  });
  
  
  
  it('Test whether it is possible to create a todo without entering any text', function() {
    var todoPage = new todoPageObject();    
    todoPage.createTodoItem();
    expect(todoPage.getTodoItem()).toEqual('undefined');
    todoPage.deleteTodo()
    
  });
  it('Test whether it is possible to create a todo list with quotes', function() {
    var todoPage = new todoPageObject();   
    todoPage.createTodoItem('""'); 
    expect(todoPage.getTodoItem()).toEqual('""');
    todoPage.deleteTodo();
    
  });
  
  
  it('Test the placeholder text of the create text area', function() {
    var todoPage = new todoPageObject();   
    expect(browser.driver.findElement(by.id('new-todo')).getAttribute('placeholder')).toEqual('What needs to be done?');
    
  }); 
  
  it('Test whether it is not possible to add maliciuos script contents , it must no display any alert.', function() {
    var todoPage = new todoPageObject(); 
     
    todoPage.createTodoItem('><script>alert("hi")</script><');
    
    expect(todoPage.getTodoItem()).toEqual('><script>alert("hi")</script><');
    todoPage.deleteTodo();
    
    
    
  }); 
  it('Test whether it is possibe to multiple Todo items.', function() {
    var todoPage = new todoPageObject();
    
    for(var i=0;i<=2;i++){
        todoPage.createTodoItem('test'+i); 
    
    }
    expect(browser.driver.findElement(by.id('todo-count')).getText()).toEqual('3 items left');
    //cleanup the test data
    for(var i =0;i<=2;i++){
        todoPage.deleteTodo();
        
    }

  }); 
  it('Test clearCompleted functionality.', function() {
    var todoPage = new todoPageObject();
    
    
    todoPage.createTodoItem('active');
    todoPage.createTodoItem('complete');
    browser.driver.findElement(by.css('#todo-list > li > div > input')).click();
    browser.driver.findElement(by.css('#clear-completed > span:nth-child(1)')).click();
    expect(todoPage.getTodoCount()).toEqual('1 item left');
    todoPage.deleteTodo();
    
    

  }); 
  
  it('Test whether active tab displays only the non complete Todo lists.', function() {
    var todoPage = new todoPageObject();
    
    
    todoPage.createTodoItem('active');
    todoPage.createTodoItem('complete');
    todoPage.createTodoItem('test');
    todoPage.completeTodo();
    todoPage.activeTodoList();
    expect(browser.driver.findElement(by.css('#todo-list > li:nth-child(1) > div > label')).getText()).toEqual('complete');
    expect(browser.driver.findElement(by.css('#todo-list > li:nth-child(2) > div > label')).getText()).toEqual('test');
    todoPage.allTodoList(); 
    browser.driver.findElement(by.css('#clear-completed > span:nth-child(1)')).click();
    for(var i=0;i<=1;i++) {
        todoPage.deleteTodo();
    
    }
    
    
    

  }); 
  
  it('Test whether the completed tab displays only the completed Todo lists.', function() {
    var todoPage = new todoPageObject();
    
    
    todoPage.createTodoItem('complete');
    todoPage.createTodoItem('active');
    todoPage.createTodoItem('test');
    todoPage.completeTodo();
    todoPage.completedTodoList();
    expect(browser.driver.findElement(by.css('#todo-list > li > div > label')).getText()).toEqual('complete');
    
    todoPage.allTodoList();
    browser.driver.findElement(by.css('#clear-completed > span:nth-child(1)')).click();    
    for(var i=0;i<=1;i++) {
        todoPage.deleteTodo();
    
    }
    
    });
    
    it('Test the count of  completedTodo list is updated properly.', function() {
    var todoPage = new todoPageObject();
    
    
    todoPage.createTodoItem('complete');
    todoPage.createTodoItem('active');
    todoPage.createTodoItem('test');
    todoPage.markAllTodoList();
    expect(todoPage.getTodoCount()).toEqual('0 items left');
    browser.driver.findElement(by.css('#clear-completed > span:nth-child(1)')).click();
    
    
    });
    
    it('Test the functionality of markAllTodo', function() {
    var todoPage = new todoPageObject();
    
    
    todoPage.createTodoItem('complete');
    todoPage.createTodoItem('active');
    todoPage.createTodoItem('test');
    todoPage.markAllTodoList();
    expect(todoPage.getTodoCount()).toEqual('0 items left');
    browser.driver.findElement(by.css('#clear-completed > span:nth-child(1)')).click();
    
    
    });
  it('Test the editing functionality on double click.', function() {
    var todoPage = new todoPageObject();
       
    todoPage.createTodoItem('test');
    browser.driver.actions().doubleClick(browser.driver.findElement(by.css('#todo-list > li > div > label'))).perform()
    browser.driver.findElement(by.css('#todo-list > li > input')).sendKeys(' edit');
    ptor = protractor.getInstance()
    ptor.actions().sendKeys(protractor.Key.ENTER).perform();
    todoPage.deleteTodo();
    
  }); 
  
  it('Test whether the leading and trailing whitespaces are trimmed while creating todoList', function() {
    var todoPage = new todoPageObject();
        
    todoPage.createTodoItem('  fd  ');
    expect(todoPage.getTodoItem()).toEqual('fd');
    todoPage.deleteTodo();
    
  });
  
  it('Test whether the toggle action of MarkallTodo works', function() {
    var todoPage = new todoPageObject();
        
    todoPage.createTodoItem('test');
    todoPage.createTodoItem('test1');
    todoPage.createTodoItem('test2');
    todoPage.markAllTodoList();
    todoPage.markAllTodoList();
    expect(todoPage.getTodoCount()).toEqual('3 items left');
    
    
  });
  
  
  
  });