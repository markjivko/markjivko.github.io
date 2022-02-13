<?php

/**
 * Singleton class
 */
class Singleton {
    
    // @TODO Implement Singleton functionality
    
    /**
     * User input is displayed
     * 
     * @param string $name User-provided name
     */
    public function userEcho($name) {
        // @TODO Fix
        echo "The value of 'name' is '{$name}'";
    }
    
    /**
     * User input in queries
     * 
     * @param string $name User-provided name
     */
    public function userQuery($name) {
        // @TODO Fix
        mysql_query("SELECT * FROM `test` WHERE `name` = '{$name}' LIMIT 1");
    }
    
    /**
     * Output the contents of a file
     * 
     * @param string $path User-provided file path
     */
    public function userFile($path) {
        // @TODO Fix
        readfile($path);
    }
    
    /**
     * Nested conditions
     */
    public function nestedConditions() {
        // @TODO Untangle nested IFs
        if ($conditionA) {
            if ($conditionB) {
                if ($conditionC) {
                    echo 'ABC';
                } else {
                    echo '^C';
                }
            } else {
                echo '^B';
            }
        } else {
            echo '^A';
        }
    }
    
    /**
     * Return values
     * 
     * @return boolean
     */
    public function returnStatements() {
        // @Fix
        if ($conditionA) {
            echo 'A';
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Null coalescing
     */
    public function nullCoalescing() {
        // @TODO Use null coalescing operator
        if (isset($_GET['name'])) {
            $name = $_GET['name'];
        } elseif (isset($_POST['name'])) {
            $name = $_POST['name'];
        } else {
            $name = 'nobody';
        }
        return $name;
    }
    
    /**
     * Method chaining
     */
    public function methodChained() {
        // @TODO Implement method chaining
    }
    
    /**
     * Immutables are hard to find
     */
    public function checkValue($value) {
        $result = null;
        
        // @TODO Make all the immutable values (int, string) in this class easily replaceable
        switch ($value) {
            case 'stringA':
                $result = 1;
                break;
                
            case 'stringB':
                $result = 2;
                break;
        }
        
        return $result;
    }
    
    /**
     * Check a string is a 24 hour time
     * 
     * @example "00:00:00", "23:59:59", "20:15"
     * @return boolean
     */
    public function regexTest($time24Hour) {
        // @TODO Implement RegEx and return type; sanitize input
        return preg_match('%%', $time24Hour);
    }
    
}

/*EOF*/
