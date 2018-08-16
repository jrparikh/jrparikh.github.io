using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuildCity : MonoBehaviour {

    public GameObject[] buildings;
    public GameObject diagstreets;
    public GameObject xstreets;
    public GameObject zstreets;
    //public GameObject crossroad;
    public int mapWidth = 20;
    public int mapHeight = 20;
    int[,] mapgrid;
    int buildingFootprint = 2;
    //public GameObject objectPrefab;
    List<GameObject> listeroni = new List<GameObject>();
    List<GameObject> windowListeroni = new List<GameObject>();
    //List<int> randonum = new List<int>();
    int[] randomnum;

    // Use this for initialization
    void Start () {
        float seed = Random.Range(1, 75);

        //generate map
        mapgrid = new int[mapWidth, mapHeight];
        for (int h = 0; h < mapHeight; h++)
        {
            for (int w = 0; w < mapWidth; w++)
            {
                mapgrid[w, h] = (int)(Mathf.PerlinNoise(w / 10.0f + seed, h / 10.0f + seed) * 10);
            }
        }

        //build streets
        int x = 0;
        for(int n = 0; n < 50; n++)
        {
            for(int h = 0; h < mapHeight; h++)
            {
                mapgrid[x, h] = -1;
            }
            x += Random.Range(3, 3);
            if (x >= mapWidth) break;
        }

        //build streets
        int z = 0;
        for (int n = 0; n < 10; n++)
        {
            for (int w = 0; w < mapWidth; w++)
            {
                mapgrid[w, z] = -2;
            }
            z += Random.Range(2, 20);
            if (z >= mapHeight) break;
        }
        //generate city
        for (int h = 0; h < mapHeight; h++)
        {
            mapgrid[h, h] = -3;
            for (int w = 0; w < mapWidth; w++)
            {
                int noiseVal = mapgrid[w, h];
                
                Vector3 pos = new Vector3(w * buildingFootprint, 0, h * buildingFootprint);
                if(noiseVal < -3)
                {
                    Instantiate(diagstreets, pos, transform.rotation);
                }
                else if (noiseVal < -1)
                {
                    Instantiate(xstreets, pos, transform.rotation);
                }
                else if(noiseVal < 0)
                {
                    Instantiate(zstreets, pos, transform.rotation);
                }
                else if (noiseVal < 2)
                {
                    GameObject newObject = Instantiate(buildings[0], pos, Quaternion.identity);   
                }
                else if (noiseVal < 4)
                {
                    GameObject newObject = Instantiate(buildings[1], pos, Quaternion.identity);
                    //listeroni.Add(newObject);
                }
                else if (noiseVal < 6)
                {
                    GameObject newObject = Instantiate(buildings[2], pos, Quaternion.identity);
                    listeroni.Add(newObject);

                }
                else if (noiseVal < 8)
                {
                    GameObject newObject = Instantiate(buildings[3], pos, Quaternion.identity);
                    listeroni.Add(newObject);
              
                }
                else if (noiseVal < 10)
                {
                    GameObject newObject = Instantiate(buildings[4], pos, Quaternion.identity);
                    listeroni.Add(newObject);
                }//add destroy window function here instead of separate script
            }
        }
        randomnum = new int[listeroni.Count];
        for(int i = 0; i < listeroni.Count; i++)
        {
            randomnum[i] = Random.Range(1, 4);
            //Debug.Log(randomnum[i]);
        }
        
        Fisher_Yates_CardDeck_Shuffle(listeroni);
        

        for (int i = 0; i < listeroni.Count; i++)
        {
            listeroni[i].transform.localScale += new Vector3(0, randomnum[i] - 1, 0);
            if (randomnum[i] < 2)
            {
                listeroni[i].GetComponent<MeshRenderer>().material.color = Color.black;
            }
            else if (randomnum[i] < 3)
            {
                listeroni[i].GetComponent<MeshRenderer>().material.color = new Color32(139, 69, 19, 1);
            }
            else if (randomnum[i] < 4)
            {
                listeroni[i].GetComponent<MeshRenderer>().material.color = new Color32(165, 42, 42, 1);
            }
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

}
