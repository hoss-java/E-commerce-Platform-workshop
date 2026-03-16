package com.ecommerce;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class ECommerceAppTest 
    extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public ECommerceAppTest( String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( ECommerceAppTest.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testECommerceApp()
    {
        assertTrue( true );
    }
}
