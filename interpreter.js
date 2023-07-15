function interpret(code) {
    var lines = code.split("\n");
    var variables = {};
  
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
  
      if (line.startsWith("var ")) {
        var varName = line.split(" ")[1];
        var varValue = line.split(" ")[3].replace(";", "");
        variables[varName] = varValue;
      } else if (line.startsWith("if ")) {
        var condition = line.split(" ")[1];
        var thenBlock = lines.slice(i + 1, lines.length).join("\n");
        var elseBlock = "";
        var endIfIndex = lines.indexOf("endif");
  
        if (endIfIndex !== -1) {
          thenBlock = lines.slice(i + 1, endIfIndex).join("\n");
          elseBlock = lines.slice(endIfIndex + 1, lines.length).join("\n");
        }
  
        if (evaluateCondition(condition, variables)) {
          interpret(thenBlock);
        } else {
          interpret(elseBlock);
        }
  
        break;
      } else if (line.startsWith("for ")) {
        var varName = line.split(" ")[1];
        var startValue = parseInt(line.split(" ")[3]);
        var endValue = parseInt(line.split(" ")[5]);
        var step = parseInt(line.split(" ")[7]);
        var loopBlock = lines.slice(i + 1, lines.length).join("\n");
  
        for (var j = startValue; j <= endValue; j += step) {
          variables[varName] = j.toString();
          interpret(loopBlock);
        }
  
        break;
      } else if (line.startsWith("function ")) {
        var functionName = line.split(" ")[1];
        var functionArgs = line.substring(line.indexOf("(") + 1, line.indexOf(")")).split(",");
        var functionBody = lines.slice(i + 1, lines.indexOf("endfunction")).join("\n");
  
        variables[functionName] = function() {
          for (var k = 0; k < functionArgs.length; k++) {
            functionBody = functionBody.replace(functionArgs[k], variables[functionArgs[k]]);
          }
  
          interpret(functionBody);
        };
      } else if (line.startsWith("return ")) {
        return line.split(" ")[1];
      } else if (line.startsWith("print ")) {
        var text = line.substring(line.indexOf(" ") + 1, line.indexOf(";"));
        console.log(text);
      } else {
        var command = line.replace(";", "");
        command = replaceVariables(command, variables);
        eval(command);
      }
    }
  }
  
  function evaluateCondition(condition, variables) {
    var leftSide = condition.split(" ")[0];
    var operator = condition.split(" ")[1];
    var rightSide = condition.split(" ")[2];
  
    leftSide = replaceVariables(leftSide, variables);
    rightSide = replaceVariables(rightSide, variables);
  
    switch (operator) {
      case "==":
        return leftSide == rightSide;
      case "!=":
        return leftSide != rightSide;
      case "<":
        return leftSide < rightSide;
      case ">":
        return leftSide > rightSide;
      case "<=":
        return leftSide <= rightSide;
      case ">=":
        return leftSide >= rightSide;
      default:
        return false;
    }
  }
  
  function replaceVariables(command, variables) {
    var keys = Object.keys(variables);
  
    for (var i = 0; i < keys.length; i++) {
      var key = keys
      if (command.includes(key)) {
        command = command.replace(new RegExp(key, 'g'), variables[key]);
      }
      }
      
      return command;
      }