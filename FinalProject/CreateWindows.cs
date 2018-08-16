using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CreateWindows : MonoBehaviour {

    List<GameObject> listeroni = new List<GameObject>();
    // Use this for initialization
    void Start () {
        //Renderer rend = GetComponent<Renderer>();
        foreach (Transform child in transform)
        {
            listeroni.Add(child.gameObject);
            //rend.material.shader = Shader.Find("_Color");
           
            //Debug.Log(listeroni);
        }
        Fisher_Yates_CardDeck_Shuffle(listeroni);
        for (int i = 0; i < listeroni.Count / 2f; i++)
        {
            Destroy(listeroni[i]);
             //rend.material.SetColor("_Color", Color.green);
        }
    }

    public static List<GameObject> Fisher_Yates_CardDeck_Shuffle(List<GameObject> aList)
    {
        System.Random _random = new System.Random();
        GameObject myGO;

        int n = aList.Count;
        for (int i = 0; i < n; i++)
        {
            int r = i + (int)(_random.NextDouble() * (n - i - 1));
            myGO = aList[r];
            aList[r] = aList[i];
            aList[i] = myGO;
        }
        return aList;
    }
    // Update is called once per frame
    void Update () {
		
	}
}
