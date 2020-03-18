from main import app
import unittest


class FlaskTestCase(unittest.TestCase):

    print('Test that "/" returns a 200 status code and flask api is running')

    def test_index(self):
        test = app.test_client(self)
        response = test.get("/", content_type="html/text")
        self.assertEqual(response.status_code, 200)

    print("Test that getting covid by ID 1 returns a 200 status code")

    def test_get_covid_by_id(self):
        test = app.test_client(self)
        response = test.get("/covid?id=1", content_type="html/text")
        self.assertEqual(response.status_code, 200)

    print(
        "Test that output of getting covid by ID 2 includes the expected Country Name"
    )

    def test_get_coronas_by_id_output(self):
        test = app.test_client(self)
        response = test.get("/covid?id=2", content_type="html/text")
        self.assertTrue(b"Maldives" in response.data)

    print("Test that getting all covid data from the API returns a 200 status code")

    def test_get_all_covid_status_code(self):
        test = app.test_client(self)
        response = test.get("/covid", content_type="html/text")
        self.assertEqual(response.status_code, 200)

    def test_404(self):
        test = app.test_client(self)
        response = test.get("/asdsdf", content_type="html/text")
        print(response)
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
